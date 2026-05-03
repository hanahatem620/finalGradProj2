'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FaStar } from 'react-icons/fa6'
import { CiStar } from 'react-icons/ci'
import { toast } from 'sonner'
import { BookingRow } from '@/types/bookingRow.type'

// interface BookingRow {
//   id: number
//   provider_id: number
//   provider_name: string
//   provider_image: string | null
//   start_datetime: string
//   status: string
//   reviewed: boolean
// }

function LeaveReviewInner() {
  const router = useRouter()
  const params = useSearchParams()
  const bookingId = Number(params.get('booking')) || null

  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!bookingId) { setLoading(false); return }
      try {
        const res = await fetch('/api/me/bookings')
        if (!res.ok) return
        const list: BookingRow[] = await res.json()
        if (!cancelled) setBooking(list.find(b => b.id === bookingId) ?? null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [bookingId])

  async function submit() {
    if (!bookingId) return
    if (rating < 1) {
      toast.error('Please pick a star rating', { position: 'top-center' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, rating, comment }),
      })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        toast.error(data.msg || 'Failed to submit review', { position: 'top-center' })
        return
      }
      toast.success('Review submitted — thank you!', { position: 'top-center' })
      router.push('/client/booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='font-bold text-3xl'>Leave a Review</h1>
        <p className='text-gray-500 text-sm'>
          Share your experience to help others find the perfect artist
        </p>
      </motion.div>

      <div className='flex flex-col lg:flex-row gap-4 mt-5'>
        <motion.div
          className='lg:w-[50%]'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <div className='bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex flex-col gap-5'>
            {loading ? (
              <div className='animate-pulse h-20 bg-gray-100 rounded-md' />
            ) : !booking ? (
              <div className='text-center text-gray-500 py-6'>
                Booking not found. <button className='text-pink-500' onClick={() => router.push('/client/booking')}>Go back</button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-3'>
                  {booking.provider_image ? (
                    <img
                      src={`/uploads/${booking.provider_image}`}
                      alt={booking.provider_name}
                      width={50}
                      height={50}
                      className='rounded-full object-cover aspect-square'
                    />
                  ) : (
                    <div className='w-12.5 h-12.5 rounded-full bg-linear-to-br from-pink-300 to-pink-500 flex items-center justify-center text-white font-bold text-xl'>
                      {booking.provider_name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className='font-bold text-xl'>{booking.provider_name}</h2>
                    <p className='text-gray-500 text-sm'>
                      {new Date(booking.start_datetime).toLocaleDateString(undefined, {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className='font-bold mb-2'>How would you rate your experience?</h2>
                  <div className='flex gap-2'>
                    {[1, 2, 3, 4, 5].map(n => {
                      const filled = n <= (hover || rating)
                      return (
                        <motion.button
                          key={n}
                          type='button'
                          onMouseEnter={() => setHover(n)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(n)}
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ scale: 1.15 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          aria-label={`${n} star`}
                        >
                          {filled ? (
                            <FaStar className='text-3xl text-yellow-400 drop-shadow' />
                          ) : (
                            <CiStar className='text-3xl text-gray-300' />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className='font-bold mb-1'>Tell us about your experience</h2>
                  <Textarea
                    placeholder='Write your review here...'
                    className='w-full border border-gray-300'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className='flex gap-2'>
                  <Button
                    className='bg-pink-500 text-white rounded-md flex-1 hover:bg-pink-600'
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </Button>
                  <Button variant='outline' onClick={() => router.push('/client/booking')}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          className='lg:w-[50%] flex flex-col gap-5'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <div className='bg-linear-to-br from-pink-300 to-pink-400 p-5 flex flex-col gap-3 rounded-xl text-white'>
            <h2 className='font-bold text-lg'>Earn Points!</h2>
            <p className='text-white/90 max-w-xs'>
              Leave a review and earn 10 bonus loyalty points
            </p>
            <div className='flex items-center gap-2'>
              <FaStar />
              <h2 className='font-bold'>+10 Points</h2>
            </div>
          </div>

          <div className='shadow-sm border border-gray-100 rounded-xl p-5 bg-white'>
            <h2 className='font-bold'>Review Tips</h2>
            <ul className='text-gray-600 mt-2 space-y-1 text-sm'>
              <li><i className='fa-solid fa-check text-pink-500 me-2'></i>Be honest and specific</li>
              <li><i className='fa-solid fa-check text-pink-500 me-2'></i>Mention the artist&apos;s strengths</li>
              <li><i className='fa-solid fa-check text-pink-500 me-2'></i>Include what could be improved</li>
              <li><i className='fa-solid fa-check text-pink-500 me-2'></i>Add photos if possible</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LeaveReview() {
  return (
    <Suspense fallback={<div className='py-20 text-center text-gray-500'>Loading…</div>}>
      <LeaveReviewInner />
    </Suspense>
  )
}
