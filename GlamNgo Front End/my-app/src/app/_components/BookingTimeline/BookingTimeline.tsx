'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Status = 'available' | 'unavailable' | 'booked' | 'past'
export interface Segment {
  start: string
  end: string
  status: Status
  reason?: string
}

export interface BookingTimelineProps {
  segments: Segment[]
  duration: number           // minutes; 0 = no services picked yet
  value: string              // "HH:MM" current start
  onChange: (start: string) => void
  loading?: boolean
}

// One pixel per minute × 45/60 ≈ 0.75 px/min → 45 px/hour.
// Combined with cropping to working hours (see `visibleRange` below) this
// yields a timeline that's typically ~400 px tall — comfortable next to the
// calendar without dwarfing it.
const PX_PER_MIN = 45 / 60
const SNAP = 15
// Bars ≥ 36 px → two-line label ("16:00 – 16:30" / "30 min")
// Bars 20 – 36 px → compact single-line label ("16:00 – 16:30 · 30m")
// Bars < 20 px → floating pink pill *outside* the clipped track
const INLINE_LABEL_MIN_PX = 20
const TWO_LINE_MIN_PX = 36
const BUFFER_MIN = 30          // 30-min padding around working hours
const DEFAULT_RANGE = [8 * 60, 20 * 60] // fallback 08:00–20:00
const MAX_TRACK_HEIGHT = 540   // never taller than this, even 24h businesses

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
function segEndMin(s: string): number { return s === '24:00' ? 1440 : toMin(s) }

function isValidStart(segments: Segment[], start: number, duration: number): boolean {
  const end = start + duration
  if (start < 0 || end > 1440) return false
  for (const s of segments) {
    if (s.status !== 'available') continue
    const a = toMin(s.start), b = segEndMin(s.end)
    if (start >= a && end <= b) return true
  }
  return false
}

function nearestValid(segments: Segment[], candidate: number, duration: number): number | null {
  const snapped = Math.round(candidate / SNAP) * SNAP
  if (isValidStart(segments, snapped, duration)) return snapped
  for (let delta = SNAP; delta <= 1440; delta += SNAP) {
    const a = snapped - delta, b = snapped + delta
    if (isValidStart(segments, b, duration)) return b
    if (isValidStart(segments, a, duration)) return a
  }
  return null
}

const segColor: Record<Status, string> = {
  available:   'transparent',
  unavailable: 'repeating-linear-gradient(45deg,#e5e7eb 0 6px,#f3f4f6 6px 12px)',
  booked:      'repeating-linear-gradient(45deg,#fecaca 0 6px,#fee2e2 6px 12px)',
  past:        'repeating-linear-gradient(45deg,#9ca3af 0 6px,#d1d5db 6px 12px)',
}

export default function BookingTimeline({
  segments, duration, value, onChange, loading,
}: BookingTimelineProps) {
  const startMin = toMin(value)
  const endMin = startMin + duration
  const trueBarHeight = duration * PX_PER_MIN
  const labelInside = trueBarHeight >= INLINE_LABEL_MIN_PX
  const twoLineLabel = trueBarHeight >= TWO_LINE_MIN_PX

  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hoverMin, setHoverMin] = useState<number | null>(null)

  // ── Visible window: crop to working hours (+ buffer) so the user doesn't
  //    have to scroll past a wall of gray stripes. Fallback = 08:00–20:00.
  const [rangeStart, rangeEnd] = useMemo(() => {
    const avail = segments.filter(s => s.status === 'available')
    if (avail.length === 0) return DEFAULT_RANGE
    const starts = avail.map(s => toMin(s.start))
    const ends   = avail.map(s => segEndMin(s.end))
    let a = Math.max(0,    Math.min(...starts) - BUFFER_MIN)
    let b = Math.min(1440, Math.max(...ends)   + BUFFER_MIN)
    // Expand slightly to the hour so tick labels line up cleanly
    a = Math.floor(a / 60) * 60
    b = Math.ceil(b / 60) * 60
    return [a, b]
  }, [segments])

  const visibleMin = rangeEnd - rangeStart
  const trackHeight = Math.min(MAX_TRACK_HEIGHT, visibleMin * PX_PER_MIN)
  const effectivePxPerMin = trackHeight / visibleMin

  function yForMin(m: number): number {
    return (m - rangeStart) * effectivePxPerMin
  }

  const noSelection = duration <= 0
  const selectionValid = !noSelection && isValidStart(segments, startMin, duration)
  const suggestedStart =
    noSelection || selectionValid ? null : nearestValid(segments, startMin, duration)
  const hasAnySlot = !noSelection
    && segments.some(s => s.status === 'available')
    && nearestValid(segments, 0, duration) !== null

  // Auto-recover invalid selection (e.g. user added a service)
  useEffect(() => {
    if (noSelection || !segments.length) return
    if (isValidStart(segments, startMin, duration)) return
    const next = nearestValid(segments, startMin, duration)
    if (next !== null) onChange(toHHMM(next))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, duration])

  function beginDrag(e: React.PointerEvent) {
    if (!trackRef.current || !hasAnySlot) return
    e.preventDefault()
    e.stopPropagation()
    const initialY = e.clientY
    const initialStart = startMin
    setDragging(true)

    const onMove = (ev: PointerEvent) => {
      const deltaMin = (ev.clientY - initialY) / effectivePxPerMin
      const candidate = Math.max(0, Math.min(1440 - duration, initialStart + deltaMin))
      const valid = nearestValid(segments, candidate, duration)
      if (valid !== null) onChange(toHHMM(valid))
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function clickTrack(e: React.MouseEvent) {
    if (!trackRef.current || dragging || !hasAnySlot) return
    const rect = trackRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const minAtCursor = rangeStart + y / effectivePxPerMin
    const candidate = minAtCursor - duration / 2
    const valid = nearestValid(segments, Math.max(0, candidate), duration)
    if (valid !== null) onChange(toHHMM(valid))
  }

  function trackHover(e: React.MouseEvent) {
    if (!trackRef.current || dragging) return
    const rect = trackRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    setHoverMin(rangeStart + y / effectivePxPerMin)
  }

  // Render only segments that intersect the visible window, clipped to it.
  const visibleSegs = segments.map(s => {
    const a = toMin(s.start), b = segEndMin(s.end)
    const aClip = Math.max(rangeStart, a)
    const bClip = Math.min(rangeEnd,  b)
    if (bClip <= aClip) return null
    return { s, top: yForMin(aClip), height: (bClip - aClip) * effectivePxPerMin }
  }).filter(Boolean) as { s: Segment; top: number; height: number }[]

  // Hour tick labels inside the track (every whole hour in view)
  const ticks: number[] = []
  for (let h = rangeStart / 60; h <= rangeEnd / 60; h++) {
    ticks.push(h)
  }

  // Callout lives in a dedicated sibling lane next to the track (see JSX
  // below), so we position it from the lane's left edge — not the track's.
  function ShortBarCallout({ top, pink = true }: { top: number; pink?: boolean }) {
    return (
      <div
        className={`absolute left-0 px-2 py-1 rounded-md text-[11px] font-semibold shadow whitespace-nowrap pointer-events-none ${
          pink ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 border border-pink-200'
        }`}
        style={{ top: top - 4 }}
      >
        {toHHMM(startMin)} – {toHHMM(endMin)} · {duration}m
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {/* The track */}
      <div className='flex gap-3'>
        {/* Hour labels column */}
        <div className='relative shrink-0' style={{ width: 44, height: trackHeight }}>
          {ticks.map(h => (
            <div
              key={h}
              className='absolute right-2 text-[10px] text-gray-400 font-mono leading-none'
              style={{ top: yForMin(h * 60) - 5 }}
            >
              {`${h.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>

        {/* Track + adjacent callout lane laid out as a flex row, so short-bar
            callouts sit right next to the track instead of escaping to the
            far edge of a flex-1 wrapper. */}
        <div className='flex-1 min-w-0 flex gap-2 items-start'>
          <div
            ref={trackRef}
            onMouseMove={trackHover}
            onMouseLeave={() => setHoverMin(null)}
            onClick={clickTrack}
            className={`relative flex-1 min-w-0 rounded-lg overflow-hidden border border-gray-200 select-none bg-white ${
              hasAnySlot ? 'cursor-crosshair' : 'cursor-not-allowed'
            }`}
            style={{ height: trackHeight }}
          >
            {/* Hourly grid lines */}
            {ticks.slice(1).map(h => (
              <div
                key={h}
                className='absolute left-0 right-0 border-t border-gray-100'
                style={{ top: yForMin(h * 60) }}
              />
            ))}

            {loading ? (
              <div className='absolute inset-0 flex items-center justify-center text-gray-400 text-sm'>
                Loading availability…
              </div>
            ) : visibleSegs.map(({ s, top, height }, i) => (
              <div
                key={i}
                className='absolute left-0 right-0 pointer-events-none'
                style={{ top, height, background: segColor[s.status] }}
              >
                {s.status === 'booked' && height > 24 && (
                  <span className='absolute top-1 left-2 text-[10px] font-semibold text-red-500/70 uppercase tracking-wide'>
                    Booked
                  </span>
                )}
                {s.status === 'past' && height > 24 && (
                  <span className='absolute top-1 left-2 text-[10px] font-semibold text-gray-500/80 uppercase tracking-wide'>
                    Past
                  </span>
                )}
              </div>
            ))}

            {/* Empty-state overlays */}
            {!loading && noSelection && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='bg-white/90 backdrop-blur rounded-lg border border-gray-200 px-4 py-3 text-center max-w-60 shadow-sm'>
                  <div className='text-sm font-semibold text-gray-700'>Pick a service</div>
                  <div className='text-xs text-gray-500 mt-0.5'>
                    Your time-block appears here once services are selected.
                  </div>
                </div>
              </div>
            )}
            {!loading && !noSelection && !hasAnySlot && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='bg-white/90 backdrop-blur rounded-lg border border-gray-200 px-4 py-3 text-center max-w-60 shadow-sm'>
                  <div className='text-sm font-semibold text-gray-700'>No slot fits today</div>
                  <div className='text-xs text-gray-500 mt-0.5'>
                    Try another date or fewer services.
                  </div>
                </div>
              </div>
            )}

            {/* Hover preview */}
            {!dragging && hoverMin !== null && hasAnySlot && (
              <div
                className='absolute left-0 right-0 border-t-2 border-dashed border-pink-300 pointer-events-none'
                style={{ top: yForMin(hoverMin) }}
              />
            )}

            {/* Selection bar — true height, no min clamp */}
            {!loading && hasAnySlot && selectionValid && (
              <motion.div
                onPointerDown={beginDrag}
                onClick={(e) => e.stopPropagation()}
                initial={false}
                animate={{ top: yForMin(startMin) }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className='absolute left-2 right-2 rounded-md cursor-grab active:cursor-grabbing shadow-md ring-2 ring-pink-300 bg-linear-to-b from-pink-500 to-pink-600 flex flex-col items-center justify-center text-white font-semibold overflow-hidden px-2'
                style={{ height: trueBarHeight }}
              >
                {labelInside && (
                  twoLineLabel ? (
                    <>
                      <div className='text-[11px] leading-tight opacity-95'>
                        {toHHMM(startMin)} – {toHHMM(endMin)}
                      </div>
                      <div className='text-[10px] opacity-80'>{duration} min</div>
                    </>
                  ) : (
                    // Compact single line for short-but-readable bars (≈20–36 px)
                    <div className='text-[10px] leading-none opacity-95 whitespace-nowrap tracking-tight'>
                      {toHHMM(startMin)} – {toHHMM(endMin)} · {duration}m
                    </div>
                  )
                )}
              </motion.div>
            )}

            {/* Ghost at suggested start when current pick doesn't fit */}
            {!loading && hasAnySlot && !selectionValid && suggestedStart !== null && (
              <motion.button
                type='button'
                onClick={() => onChange(toHHMM(suggestedStart))}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='absolute left-2 right-2 rounded-md border-2 border-dashed border-pink-400 bg-pink-50/70 hover:bg-pink-100 flex flex-col items-center justify-center text-pink-600 font-semibold overflow-hidden px-2'
                style={{
                  top: yForMin(suggestedStart),
                  height: Math.max(10, trueBarHeight),
                }}
              >
                {labelInside && (
                  twoLineLabel ? (
                    <>
                      <div className='text-[11px] leading-tight'>Tap to pick {toHHMM(suggestedStart)}</div>
                      <div className='text-[10px] opacity-80'>
                        {toHHMM(suggestedStart)} – {toHHMM(suggestedStart + duration)}
                      </div>
                    </>
                  ) : (
                    <div className='text-[10px] leading-none whitespace-nowrap tracking-tight'>
                      Tap · {toHHMM(suggestedStart)}–{toHHMM(suggestedStart + duration)}
                    </div>
                  )
                )}
              </motion.button>
            )}
          </div>

          {/* Callout lane: fixed-width sibling of the track. Only rendered
              when a short bar actually needs one, so long-duration layouts
              keep the track at full width. */}
          {!loading && hasAnySlot && !labelInside && (selectionValid || suggestedStart !== null) && (
            <div
              className='relative shrink-0'
              style={{ width: 110, height: trackHeight }}
            >
              {selectionValid && (
                <ShortBarCallout top={yForMin(startMin)} pink />
              )}
              {!selectionValid && suggestedStart !== null && (
                <ShortBarCallout top={yForMin(suggestedStart)} pink={false} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal legend below the track */}
      <div className='flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 pl-14'>
        <span className='flex items-center gap-1.5'>
          <span className='inline-block w-3 h-3 rounded-sm bg-linear-to-b from-pink-500 to-pink-600' />
          Your pick · drag me
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='inline-block w-3 h-3 rounded-sm border border-gray-200 bg-white' />
          Open
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='inline-block w-3 h-3 rounded-sm border border-gray-200' style={{ background: segColor.booked }} />
          Booked
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='inline-block w-3 h-3 rounded-sm border border-gray-200' style={{ background: segColor.past }} />
          Past
        </span>
      </div>
    </div>
  )
}
