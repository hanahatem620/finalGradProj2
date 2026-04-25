import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Returns a full-day timeline (00:00 → 24:00) split into contiguous segments
// tagged available / unavailable / booked / past. The frontend overlays these
// onto the draggable time-picker so users can only drop a booking into an
// `available` region.

type Status = 'available' | 'unavailable' | 'booked' | 'past'
interface Segment { start: string; end: string; status: Status; reason?: string }

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Paint helper: stamp [start, end) of the minute map with a cell value.
function paint(
  minutes: (Segment | null)[], startM: number, endM: number, cell: Segment,
) {
  const s = Math.max(0, startM)
  const e = Math.min(1440, endM)
  for (let i = s; i < e; i++) minutes[i] = cell
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const url = new URL(req.url)
  const dateStr = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

  const providerId = Number(id)
  if (!providerId) return NextResponse.json({ msg: 'Bad provider' }, { status: 400 })

  const date = new Date(dateStr + 'T00:00:00')
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ msg: 'Bad date' }, { status: 400 })
  }

  // availability_rules uses Python's Mon=0..Sun=6. JS uses Sun=0..Sat=6.
  const pyDow = (date.getDay() + 6) % 7

  // 1) Working hours for this weekday
  const rules = db().prepare(
    'SELECT start_time, end_time FROM availability_rules WHERE provider_id = ? AND day_of_week = ?'
  ).all(providerId, pyDow) as { start_time: string; end_time: string }[]

  // Build a 1-minute map, paint in layers. Later paints override earlier ones,
  // so order matters: [default-closed] → [working hours = available]
  //                 → [time-offs] → [existing bookings] → [past]
  const minutes: (Segment | null)[] = new Array(1440).fill(null)

  // Default: whole day is closed/before-hours.
  paint(minutes, 0, 1440, { start: '', end: '', status: 'unavailable', reason: 'before-hours' })

  // Working hours → available. Trim microseconds / seconds off TIME strings.
  for (const r of rules) {
    const s = toMin((r.start_time || '09:00:00').slice(0, 5))
    const e = toMin((r.end_time   || '17:00:00').slice(0, 5))
    paint(minutes, s, e, { start: '', end: '', status: 'available' })
  }

  // Time-offs (override available)
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0)
  const dayEnd   = new Date(date); dayEnd.setHours(24, 0, 0, 0)
  const offs = db().prepare(`
    SELECT start_datetime, end_datetime FROM time_offs
    WHERE provider_id = ?
      AND start_datetime < ? AND end_datetime > ?
  `).all(providerId, dayEnd.toISOString(), dayStart.toISOString()) as any[]
  for (const o of offs) {
    const s = (new Date(o.start_datetime).getTime() - dayStart.getTime()) / 60000
    const e = (new Date(o.end_datetime).getTime()   - dayStart.getTime()) / 60000
    paint(minutes, s, e, { start: '', end: '', status: 'unavailable', reason: 'time-off' })
  }

  // Pending / confirmed bookings occupy the slot
  const bks = db().prepare(`
    SELECT start_datetime, end_datetime FROM bookings
    WHERE provider_id = ?
      AND start_datetime < ? AND end_datetime > ?
      AND status IN ('PENDING', 'CONFIRMED')
  `).all(providerId, dayEnd.toISOString(), dayStart.toISOString()) as any[]
  for (const b of bks) {
    const s = (new Date(b.start_datetime).getTime() - dayStart.getTime()) / 60000
    const e = (new Date(b.end_datetime).getTime()   - dayStart.getTime()) / 60000
    paint(minutes, s, e, { start: '', end: '', status: 'booked' })
  }

  // Past portion of today
  const now = new Date()
  const isToday = now.toDateString() === date.toDateString()
  if (isToday) {
    const nowMin = now.getHours() * 60 + now.getMinutes()
    if (nowMin > 0) paint(minutes, 0, nowMin, { start: '', end: '', status: 'past' })
  }

  // Collapse the minute map into contiguous same-status segments.
  const segments: Segment[] = []
  let i = 0
  while (i < 1440) {
    const cur = minutes[i]!
    let j = i + 1
    while (j < 1440 && minutes[j]!.status === cur.status && minutes[j]!.reason === cur.reason) {
      j++
    }
    segments.push({
      start: toHHMM(i),
      end: j === 1440 ? '24:00' : toHHMM(j),
      status: cur.status,
      reason: cur.reason,
    })
    i = j
  }

  // Did any slot end up bookable?
  const hasAvailable = segments.some(s => s.status === 'available')

  return NextResponse.json({
    date: dateStr,
    dayOfWeek: pyDow,
    isToday,
    hasWorkingHours: rules.length > 0,
    hasAvailable,
    segments,
  })
}
