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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FaStar } from 'react-icons/fa6'
import { LuClock3, LuCreditCard } from 'react-icons/lu'
import { CiWallet } from 'react-icons/ci'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import fallbackPhoto from '../../../public/images/artistPhoto.png'
import BookingTimeline, { Segment } from '../_components/BookingTimeline/BookingTimeline'
import { Provider, Review } from '@/types/providerService.type'

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDateYMD(d: Date) {
  const y   = d.getFullYear()
  const m   = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Format card number with spaces every 4 digits
function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

// Format MM/YY
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ══════════════════════════════════════════════════════════════════════════
function ArtistPortfolioInner() {
  const router     = useRouter()
  const params     = useSearchParams()
  const providerId = Number(params.get('id'))
  const { data: session } = useSession()

  // ── Provider & reviews ─────────────────────────────────────────────────
  const [provider,     setProvider]     = useState<Provider | null>(null)
  const [reviews,      setReviews]      = useState<Review[]>([])
  const [avg,          setAvg]          = useState<number | null>(null)
  const [reviewCount,  setReviewCount]  = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(false)

  // ── Booking selection ──────────────────────────────────────────────────
  const [selected,    setSelected]    = useState<Set<number>>(new Set())
  const [date,        setDate]        = useState<Date | undefined>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d
  })
  const [time,        setTime]        = useState<string>('10:00')
  const [submitting,  setSubmitting]  = useState(false)

  // ── Availability ───────────────────────────────────────────────────────
  const [segments,             setSegments]             = useState<Segment[]>([])
  const [availabilityLoading,  setAvailabilityLoading]  = useState(false)
  // const [hasWorkingHours,      setHasWorkingHours]      = useState(true)

  // ── Payment ────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<'FAWRY' | 'CARD'>('FAWRY')
  const [cardOpen,      setCardOpen]      = useState(false)
  const [cardNumber,    setCardNumber]    = useState('')
  const [cardName,      setCardName]      = useState('')
  const [cardExpiry,    setCardExpiry]    = useState('')
  const [cardCvv,       setCardCvv]       = useState('')


  // FAWRY payment
  const [fawry, setFawry] = useState(false)
  const [fawryCode, setFawryCode] = useState("");
  

  // Card is valid when all fields are filled correctly
  const cardValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    cardName.trim().length > 0 &&
    cardExpiry.length === 5 &&
    cardCvv.length === 3

  // ── Load provider + reviews ────────────────────────────────────────────
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

  // ── Load availability ──────────────────────────────────────────────────
  useEffect(() => {
    if (!providerId || !date) return
    let cancelled = false
    setAvailabilityLoading(true)
    fetch(`/api/provider/availability/${providerId}?date=${formatDateYMD(date)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data) return
        setSegments(data.segments || [])
        console.log(data);
      })
      
      
      .finally(() => { if (!cancelled) setAvailabilityLoading(false) })
    return () => { cancelled = true }
  }, [providerId, date])

  // ── Derived values ─────────────────────────────────────────────────────
  function toggleService(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const selectedServices = provider?.services.filter(s => selected.has(s.id)) || []
  const totalDuration    = selectedServices.reduce((s, x) => s + x.duration, 0)
  const totalPrice       = selectedServices.reduce((s, x) => s + x.base_price, 0)

  // ── Booking + payment submission ───────────────────────────────────────
  async function submitBooking(method: 'FAWRY' | 'CARD') {
    if (!provider || !date) return
    setSubmitting(true)

    const [hh, mm] = time.split(':').map(Number)
    const start    = new Date(date)
    start.setHours(hh, mm, 0, 0)
    const end = new Date(start.getTime() + totalDuration * 60000)

    try {
      // 1. Create booking
      const bookingRes = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id:     provider.id,
          start_datetime:  start.toISOString(),
          end_datetime:    end.toISOString(),
          total_price:     totalPrice,
          service_ids:     Array.from(selected),
        }),
      })

      const bookingData = await bookingRes.json().catch(() => ({} as any))
      if (!bookingRes.ok) {
        toast.error(bookingData.msg || 'Booking failed', { position: 'top-center' })
        return
      }

      // 2. Record payment method (only 'FAWRY' or 'CARD' — no card details stored)
      await fetch('/api/payments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingData.id,
          method,
          amount:     totalPrice,
          status:     'COMPLETED',
        }),
      })

      toast.success('Booking confirmed!', { position: 'top-center' })
      router.push('/client/booking')

    } finally {
      setSubmitting(false)
    }
  }

  // ── Confirm button handler ─────────────────────────────────────────────
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

    if (paymentMethod === 'CARD') {
      // Open card dialog — actual booking happens after card info is filled
      setCardOpen(true)
      return
    }

      if (paymentMethod === 'FAWRY') {
      // Open card dialog — actual booking happens after card info is filled
      setFawry(true)
      return
    }

    // FAWRY — submit directly
    await submitBooking('FAWRY')
  }

useEffect(() => {
  if (fawry) {
    const code = Math.floor(100000000 + Math.random() * 900000000).toString()
    setFawryCode(code)
  }
}, [fawry])

  // ── Card dialog pay handler ────────────────────────────────────────────
  async function handleCardPay() {
    if (!cardValid) return
    setCardOpen(false)
    // Clear card fields for security — we never store them
    setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv('')
    await submitBooking('CARD')
  }

  async function handleFawryPay(){
    setFawry(false)
    await submitBooking("FAWRY")
  }

  // ── Loading / error states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className='container w-[90%] mx-auto py-10'>
        <div className='animate-pulse h-120 bg-white border border-gray-200 rounded-lg' />
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className='container w-[90%] mx-auto py-16 text-center'>
        <h1 className='text-xl font-bold text-gray-700'>Artist not found</h1>
        <Button className='mt-4' onClick={() => router.push('/artists')}>
          Browse artists
        </Button>
      </div>
    )
  }

  const avatar = provider.image_url ? `/uploads/${provider.image_url}` : null

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className='container w-[92%] lg:w-[85%] mx-auto py-8'>

      <div className='mb-4'>
        <h2 className='font-bold text-3xl'>Book Appointment</h2>
      </div>

      {/* ── Artist header ────────────────────────────────────────────── */}
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

        {/* ── Left column: services + timeline + payment ─────────────── */}
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
                        ${on
                          ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200'
                          : 'border-gray-200 hover:border-pink-300'
                        }`}
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
                          {s.description && (
                            <div className='text-xs text-gray-500'>{s.description}</div>
                          )}
                          <div className='text-xs text-gray-500 flex items-center gap-2 mt-1'>
                            <Badge className='bg-gray-100 text-gray-700'>{s.type}</Badge>
                            <span><LuClock3 className='inline' /> {s.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className='font-bold text-pink-500'>
                        EGP {s.base_price.toFixed(0)}
                      </div>
                    </motion.label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Date + Timeline */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <div className='flex items-baseline justify-between mb-3 flex-wrap gap-2'>
              <h2 className='font-bold text-xl'>Pick a date &amp; time</h2>
              <Badge className={totalDuration > 0 ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}>
                {totalDuration > 0 ? `${totalDuration} min block` : 'No services selected'}
              </Badge>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start'>
              <div>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  disabled={d => d.getTime() < new Date().setHours(0, 0, 0, 0)}
                  className='rounded-md border'
                />
              </div>
              <div className='min-w-0'>
                <h3 className='font-semibold text-sm mb-3 text-gray-600'>
                  {date?.toLocaleDateString(undefined, {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}
                </h3>
                {!segments.some(s => s.status === 'available') ? (
  <div className='border border-dashed border-gray-200 rounded-md p-6 text-center text-sm text-gray-500'>
    No available slots for this day.
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
)
                }
              </div>
            </div>
          </div>

          {/* ── Payment Method Selector ─────────────────────────────── */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-xl mb-4'>Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={v => setPaymentMethod(v as 'FAWRY' | 'CARD')}
              className='space-y-3'
            >

              {/* FAWRY */}
              <label
                htmlFor='pay-fawry'
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition
                  ${paymentMethod === 'FAWRY'
                    ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                  }`}
              >
                <RadioGroupItem value='FAWRY' id='pay-fawry' />
                <div className='bg-gray-100 p-2 rounded-lg'>
                  <CiWallet className='text-2xl text-gray-600' />
                </div>
                <div>
                  <p className='font-semibold'>Fawry</p>
                  <p className='text-xs text-gray-500'>Pay easily using your Fawry code at any nearby outle</p>
                </div>
              </label>

              {/* Card */}
              <label
                htmlFor='pay-card'
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition
                  ${paymentMethod === 'CARD'
                    ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                  }`}
              >
                <RadioGroupItem value='CARD' id='pay-card' />
                <div className='bg-blue-600 p-2 rounded-lg'>
                  <LuCreditCard className='text-2xl text-white' />
                </div>
                <div>
                  <p className='font-semibold'>Visa / MasterCard</p>
                  <p className='text-xs text-gray-500'>Pay securely with your credit or debit card</p>
                </div>
              </label>

            </RadioGroup>
          </div>

        </motion.div>

        {/* ── Right column: summary + reviews ────────────────────────── */}
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
              <div className='flex justify-between text-sm text-gray-500 mt-1'>
                <span>When</span>
                <span>
                  {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {time}
                </span>
              </div>
            )}
            <div className='flex justify-between text-sm text-gray-500 mt-1'>
              <span>Payment</span>
              <span className='font-medium text-gray-700'>
                {paymentMethod === 'CARD' ? 'Card' : 'Fawry'}
              </span>
            </div>

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
              className='w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 mt-4'
              onClick={confirm}
              disabled={submitting || selected.size === 0}
            >
              {submitting
                ? 'Booking…'
                : paymentMethod === 'CARD'
                  ? 'Continue to Payment'
                  : 'Confirm Booking'
              }
            </Button>

            <p className='text-xs text-gray-400 text-center mt-2'>
              {paymentMethod === 'FAWRY'
                ? "You won't be charged until the appointment is completed."
                : 'Your card details are never stored on our servers.'
              }
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
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    {r.comment && (
                      <p className='text-gray-700 italic mt-1'>&ldquo;{r.comment}&rdquo;</p>
                    )}
                    <p className='text-xs text-gray-400 mt-0.5'>— {r.client_name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>

      {/* ── Card Payment Dialog ───────────────────────────────────────── */}
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <LuCreditCard className='text-pink-500' />
              Card Details
            </DialogTitle>
            <DialogDescription>
              Enter your card information to complete the booking.
              Your details are never stored.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 mt-2'>

            {/* Card Number */}
            <div className='space-y-1'>
              <Label htmlFor='card-number'>Card Number</Label>
              <Input
                id='card-number'
                placeholder='1234 5678 9012 3456'
                value={cardNumber}
                maxLength={19}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className='font-mono tracking-widest'
              />
            </div>

            {/* Cardholder Name */}
            <div className='space-y-1'>
              <Label htmlFor='card-name'>Name on Card</Label>
              <Input
                id='card-name'
                placeholder='John Doe'
                value={cardName}
                onChange={e => setCardName(e.target.value)}
              />
            </div>

            {/* Expiry + CVV */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label htmlFor='card-expiry'>Expiry Date</Label>
                <Input
                  id='card-expiry'
                  placeholder='MM/YY'
                  value={cardExpiry}
                  maxLength={5}
                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                  className='font-mono'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='card-cvv'>CVV</Label>
                <Input
                  id='card-cvv'
                  placeholder='123'
                  value={cardCvv}
                  maxLength={3}
                  type='password'
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className='font-mono'
                />
              </div>
            </div>

            {/* Order summary inside dialog */}
            <div className='bg-gray-50 rounded-lg p-3 text-sm space-y-1'>
              <div className='flex justify-between text-gray-500'>
                <span>Services</span>
                <span>{selectedServices.length} selected</span>
              </div>
              <div className='flex justify-between font-bold text-base'>
                <span>Total</span>
                <span className='text-pink-500'>EGP {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex gap-3 pt-1'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => {
                  setCardOpen(false)
                  setCardNumber(''); setCardName('')
                  setCardExpiry(''); setCardCvv('')
                }}
              >
                Cancel
              </Button>
              <Button
                className='flex-1 bg-pink-500 hover:bg-pink-600'
                disabled={!cardValid || submitting}
                onClick={handleCardPay}
              >
                {submitting ? 'Processing…' : `Pay EGP ${totalPrice.toFixed(2)}`}
              </Button>
            </div>

            <p className='text-xs text-gray-400 text-center'>
              🔒 Secured — card details are never stored on our servers
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={fawry} onOpenChange={setFawry}>
  <DialogContent className='sm:max-w-md'>
    <DialogHeader>
      <DialogTitle>Fawry Code</DialogTitle>
      <DialogDescription>
        Use this code to pay at any Fawry outlet.
      </DialogDescription>
    </DialogHeader>

    <div className='space-y-4 mt-4'>

      <div className='bg-gray-100 p-4 rounded-md flex items-center justify-between'>
        <span className='font-mono text-lg'>{fawryCode}</span>

        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(fawryCode)
            toast.success("Code Copied!",{
              position:'top-center',
              duration:2000
            })
          }}
        >
          Copy
        </Button>
      </div>

      {/* Summary */}
      <div className='bg-gray-50 rounded-lg p-3 text-sm space-y-1'>
        <div className='flex justify-between text-gray-500'>
          <span>Services</span>
          <span>{selectedServices.length} selected</span>
        </div>
        <div className='flex justify-between font-bold text-base'>
          <span>Total</span>
          <span className='text-pink-500'>
            EGP {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex gap-3'>
        <Button
          variant='outline'
          className='flex-1'
          onClick={() => setFawry(false)}
        >
          Close
        </Button>

        <Button
          className='flex-1 bg-green-600 hover:bg-green-700'
          onClick={() => 
            handleFawryPay()}
        >
          Done
        </Button>
      </div>

    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}

// ── Export ─────────────────────────────────────────────────────────────────
export default function ArtistPortfolio() {
  return (
    <Suspense fallback={<div className='py-20 text-center text-gray-500'>Loading…</div>}>
      <ArtistPortfolioInner />
    </Suspense>
  )
}