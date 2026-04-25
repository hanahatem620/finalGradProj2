'use client'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FaStar } from 'react-icons/fa6'
import { LuClock3 } from 'react-icons/lu'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import fallbackPhoto from '../../../public/images/artistPhoto.png'
import BookingTimeline, { Segment } from '../_components/BookingTimeline/BookingTimeline'

interface Service {
  id: number
  title: string
  type: string
  description?: string
  duration: number
  base_price: number
}
interface Provider {
  id: number
  name: string
  email: string
  role: string
  bio: string | null
  location: string | null
  image_url: string | null
  services: Service[]
}
interface Review {
  id: number
  rating: number
  comment: string | null
  client_name: string
  created_at: string
}

function formatDateYMD(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

function ArtistPortfolioInner() {
  const router = useRouter()
  const params = useSearchParams()
  const providerId = Number(params.get('id'))
  const { data: session } = useSession()

  const [provider, setProvider] = useState<Provider | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avg, setAvg] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [date, setDate] = useState<Date | undefined>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d
  })
  const [time, setTime] = useState<string>('10:00')
  const [submitting, setSubmitting] = useState(false)

  // Availability for the currently-selected date
  const [segments, setSegments] = useState<Segment[]>([])
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [hasWorkingHours, setHasWorkingHours] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!providerId) { setError(true); setLoading(false); return }
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`/api/providers/${providerId}`),
          fetch(`/api/reviews/provider/${providerId}`),
        ])
        if (!pRes.ok) throw new Error('failed')
        const p: Provider = await pRes.json()
        const r = rRes.ok ? await rRes.json() : { reviews: [], average: null, count: 0 }
        if (!cancelled) {
          setProvider(p)
          setReviews(r.reviews || [])
          setAvg(r.average)
          setReviewCount(r.count)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [providerId])

  // Fetch availability whenever date or provider changes
  useEffect(() => {
    if (!providerId || !date) return
    let cancelled = false
    setAvailabilityLoading(true)
    fetch(`/api/provider/availability/${providerId}?date=${formatDateYMD(date)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data) return
        setSegments(data.segments || [])
        setHasWorkingHours(!!data.hasWorkingHours)
      })
      .finally(() => { if (!cancelled) setAvailabilityLoading(false) })
    return () => { cancelled = true }
  }, [providerId, date])

  function toggleService(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const selectedServices = provider?.services.filter(s => selected.has(s.id)) || []
  const totalDuration = selectedServices.reduce((s, x) => s + x.duration, 0)
  const totalPrice = selectedServices.reduce((s, x) => s + x.base_price, 0)
  // No longer forced to a 15-min minimum — the timeline shows the *real* duration.

  async function confirm() {
    if (!session?.user) {
      toast.error('Please log in first', { position: 'top-center' })
      router.push('/LogIn')
      return
    }
    if (!provider) return
    if (selected.size === 0) {
      toast.error('Please select at least one service', { position: 'top-center' })
      return
    }
    if (!date || !time) {
      toast.error('Please pick a date and time', { position: 'top-center' })
      return
    }
    const [hh, mm] = time.split(':').map(Number)
    const start = new Date(date)
    start.setHours(hh, mm, 0, 0)
    const end = new Date(start.getTime() + totalDuration * 60000)

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: provider.id,
          start_datetime: start.toISOString(),
          end_datetime: end.toISOString(),
          total_price: totalPrice,
          service_ids: Array.from(selected),
        }),
      })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        toast.error(data.msg || 'Booking failed', { position: 'top-center' })
        return
      }
      toast.success('Booking confirmed!', { position: 'top-center' })
      router.push('/client/booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='container w-[90%] mx-auto py-10'>
        <div className='animate-pulse h-[480px] bg-white border border-gray-200 rounded-lg' />
      </div>
    )
  }
  if (error || !provider) {
    return (
      <div className='container w-[90%] mx-auto py-16 text-center'>
        <h1 className='text-xl font-bold text-gray-700'>Artist not found</h1>
        <Button className='mt-4' onClick={() => router.push('/artists')}>Browse artists</Button>
      </div>
    )
  }

  const avatar = provider.image_url ? `/uploads/${provider.image_url}` : null

  return (
    <div className='container w-[92%] lg:w-[85%] mx-auto py-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6'
      >
        <div className='flex gap-4'>
          {avatar ? (
            <img
              src={avatar}
              alt={provider.name}
              width={120}
              height={120}
              className='rounded-full object-cover aspect-square'
            />
          ) : (
            <Image
              src={fallbackPhoto}
              alt={provider.name}
              width={120}
              height={120}
              className='rounded-full object-cover aspect-square'
            />
          )}
          <div>
            <h1 className='font-bold text-2xl'>{provider.name}</h1>
            <p className='text-pink-500 font-semibold'>
              {provider.role === 'artist' ? 'Makeup Artist' : 'Hair Stylist'}
            </p>
            {avg !== null && (
              <div className='flex items-center gap-1 mt-1'>
                <FaStar className='text-yellow-400' />
                <span className='font-semibold'>{avg.toFixed(1)}</span>
                <span className='text-gray-500 text-sm'>({reviewCount} reviews)</span>
              </div>
            )}
            {provider.location && (
              <div className='flex items-center gap-1 text-gray-500 text-sm mt-1'>
                <HiOutlineLocationMarker /> {provider.location}
              </div>
            )}
          </div>
        </div>
        {provider.bio && (
          <>
            <Separator orientation='vertical' className='hidden md:block' />
            <p className='text-gray-600 flex-1'>{provider.bio}</p>
          </>
        )}
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
        {/* Service picker + date/time */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className='lg:col-span-2 space-y-4'
        >
          {/* Services */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-xl mb-3'>Select services</h2>
            {provider.services.length === 0 ? (
              <div className='text-gray-500 text-sm'>
                This artist hasn&apos;t added services yet.
              </div>
            ) : (
              <div className='space-y-2'>
                {provider.services.map((s, i) => {
                  const on = selected.has(s.id)
                  return (
                    <motion.label
                      key={s.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      htmlFor={`svc-${s.id}`}
                      className={`flex justify-between items-start border rounded-md p-3 cursor-pointer transition
                        ${on ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'}`}
                    >
                      <div className='flex gap-3'>
                        <Checkbox
                          id={`svc-${s.id}`}
                          checked={on}
                          onCheckedChange={() => toggleService(s.id)}
                          className='mt-1'
                        />
                        <div>
                          <div className='font-semibold'>{s.title}</div>
                          {s.description && <div className='text-xs text-gray-500'>{s.description}</div>}
                          <div className='text-xs text-gray-500 flex items-center gap-2 mt-1'>
                            <Badge className='bg-gray-100 text-gray-700'>{s.type}</Badge>
                            <span><LuClock3 className='inline' /> {s.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className='font-bold text-pink-500'>EGP {s.base_price.toFixed(0)}</div>
                    </motion.label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Date + interactive timeline */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <div className='flex items-baseline justify-between mb-3 flex-wrap gap-2'>
              <h2 className='font-bold text-xl'>Pick a date &amp; time</h2>
              <Badge
                className={
                  totalDuration > 0
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-500'
                }
              >
                {totalDuration > 0 ? `${totalDuration} min block` : 'No services selected'}
              </Badge>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start'>
              <div>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d.getTime() < new Date().setHours(0, 0, 0, 0)}
                  className='rounded-md border'
                />
              </div>
              <div className='min-w-0'>
                <h3 className='font-semibold text-sm mb-3 text-gray-600'>
                  {date?.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {!hasWorkingHours ? (
                  <div className='border border-dashed border-gray-200 rounded-md p-6 text-center text-sm text-gray-500'>
                    This artist is off on this day.
                    <br />Pick another date.
                  </div>
                ) : (
                  <BookingTimeline
                    segments={segments}
                    duration={totalDuration}
                    value={time}
                    onChange={setTime}
                    loading={availabilityLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className='lg:sticky lg:top-4 self-start'
        >
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-xl mb-3'>Booking summary</h2>
            <AnimatePresence mode='popLayout'>
              {selectedServices.length === 0 ? (
                <motion.p
                  key='empty'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-gray-500 text-sm'
                >
                  Pick at least one service to get started.
                </motion.p>
              ) : (
                <motion.div key='items' layout className='space-y-2'>
                  {selectedServices.map(s => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className='flex justify-between text-sm'
                    >
                      <span className='text-gray-600 flex-1'>{s.title}</span>
                      <span className='font-semibold'>EGP {s.base_price.toFixed(0)}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <Separator className='my-3' />
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Duration</span>
              <span>{totalDuration} min</span>
            </div>
            {date && (
              <div className='flex justify-between text-sm text-gray-500'>
                <span>When</span>
                <span>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {time}</span>
              </div>
            )}
            <div className='flex justify-between items-end mt-3'>
              <span className='text-gray-500 text-sm'>Total</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className='font-bold text-2xl text-pink-500'
              >
                EGP {totalPrice.toFixed(2)}
              </motion.span>
            </div>
            <Button
              className='w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 mt-4'
              onClick={confirm}
              disabled={submitting || selected.size === 0}
            >
              {submitting ? 'Booking…' : 'Confirm booking'}
            </Button>
            <p className='text-xs text-gray-400 text-center mt-2'>
              You won&apos;t be charged until the appointment is completed.
            </p>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-4'>
              <h3 className='font-bold mb-2'>What clients say</h3>
              <div className='space-y-3'>
                {reviews.slice(0, 3).map(r => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-sm'
                  >
                    <div className='flex items-center gap-1 text-yellow-400'>
                      {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} />)}
                    </div>
                    {r.comment && <p className='text-gray-700 italic mt-1'>&ldquo;{r.comment}&rdquo;</p>}
                    <p className='text-xs text-gray-400 mt-0.5'>— {r.client_name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  )
}

export default function ArtistPortfolio() {
  return (
    <Suspense fallback={<div className='py-20 text-center text-gray-500'>Loading…</div>}>
      <ArtistPortfolioInner />
    </Suspense>
  )
}
