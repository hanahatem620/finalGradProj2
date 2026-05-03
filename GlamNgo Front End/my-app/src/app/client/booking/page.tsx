'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FiClock } from 'react-icons/fi'
import { LuCalendarCheck2 } from 'react-icons/lu'
import { toast } from 'sonner'
import { BookingRow } from '@/types/bookingRow.type'


const statusStyle: Record<string, string> = {
  PENDING:   'text-yellow-600 bg-yellow-100 py-1 px-4 h-fit',
  CONFIRMED: 'text-green-600 bg-green-100 py-1 px-4 h-fit',
  COMPLETED: 'text-green-600 bg-green-100 py-1 px-4 h-fit',
  CANCELLED: 'text-red-600 bg-red-100 py-1 px-4 h-fit',
}

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleDateString(undefined, {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return s }
}
function fmtRange(start: string, end: string) {
  try {
    const t = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${t(new Date(start))} – ${t(new Date(end))}`
  } catch { return '' }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as any },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

function BookingCard({ b, idx, onCancel }: {
  b: BookingRow
  idx: number
  onCancel: (id: number) => void
}) {
  return (
    <motion.div
      key={b.id}
      layout
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      custom={idx}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className='bg-white shadow-sm border border-gray-100 rounded-lg w-full p-4'
    >
      <div className='flex justify-between flex-wrap gap-3'>
        <div className='flex gap-3 items-center'>
          {b.provider_image ? (
            <img
              src={`/uploads/${b.provider_image}`}
              alt={b.provider_name}
              width={50}
              height={50}
              className='rounded-full object-cover aspect-square'
            />
          ) : (
            <div className='w-12.5 h-12.5 rounded-full bg-linear-to-br from-pink-300 to-pink-500 flex items-center justify-center text-white font-bold'>
              {b.provider_name[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className='text-lg font-bold'>{b.provider_name}</h1>
            <p className='text-sm text-pink-500 font-semibold'>
              {b.provider_role === 'artist' ? 'Makeup Artist' : 'Hair Stylist'}
            </p>
          </div>
        </div>
        <Badge className={statusStyle[b.status]}>{b.status.toLowerCase()}</Badge>
      </div>

      <div className='mt-4 space-y-1 text-sm'>
        <div className='flex items-center gap-1 text-gray-500'>
          <LuCalendarCheck2 /> {fmtDate(b.start_datetime)}, {fmtRange(b.start_datetime, b.end_datetime)}
        </div>
        <div className='flex items-center gap-1 text-gray-500'>
          <FiClock /> EGP {b.total_price.toFixed(2)}
        </div>
      </div>

      <div className='flex gap-2 mt-3 flex-wrap'>
        {b.status === 'PENDING' && (
          <>
            <Link href='/client/messageArtist'>
              <Button className='bg-pink-500 hover:bg-pink-600'>Message</Button>
            </Link>
            <Button variant='outline' onClick={() => onCancel(b.id)}>
              Cancel
            </Button>
          </>
        )}
        {b.status === 'CONFIRMED' && (
          <>
            <Link href='/client/messageArtist'>
              <Button className='bg-pink-500 hover:bg-pink-600'>Message Artist</Button>
            </Link>
            {/* <Link href='/client/rescheduleAppointment'>
              <Button variant='outline'>Reschedule</Button>
            </Link> */}
            <Button
              variant='outline'
              className='border-red-200 text-red-600 hover:bg-red-50'
              onClick={() => onCancel(b.id)}
            >
              Cancel
            </Button>
          </>
        )}
        {b.status === 'COMPLETED' && !b.reviewed && (
          <>
            <Link href={`/client/leaveReview?booking=${b.id}`}>
              <Button className='bg-pink-500 hover:bg-pink-600'>Leave Review</Button>
            </Link>
            <Link href={`/artistPortfolio?id=${b.provider_id}`}>
              <Button variant='outline'>Book Again</Button>
            </Link>
          </>
        )}
        {b.status === 'COMPLETED' && b.reviewed && (
          <>
            <Badge className='bg-gray-100 text-gray-600 py-1 px-3'>Review submitted</Badge>
            <Link href={`/artistPortfolio?id=${b.provider_id}`}>
              <Button variant='outline'>Book Again</Button>
            </Link>
          </>
        )}
        {b.status === 'CANCELLED' && (
          <Link href={`/artistPortfolio?id=${b.provider_id}`}>
            <Button className='bg-pink-500 hover:bg-pink-600'>Book Again</Button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className='bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500'>
      No {label} bookings yet.
      <div className='mt-2'>
        <Link href='/artists' className='text-pink-500 font-semibold'>
          Find an artist →
        </Link>
      </div>
    </div>
  )
}

export default function ClientBooking() {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch('/api/me/bookings')
      if (res.ok) setBookings(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

 function cancel(id: number) {
  toast("Cancel this booking?", {
    position: "top-center",

    action: {
      label: "Yes",
      onClick: async () => {
        try {
          const res = await fetch(`/api/bookings/${id}/cancel`, {
            method: "POST",
          });

          if (res.ok) {
            toast.success("Booking cancelled", { position: "top-center" });

            setBookings(prev =>
              prev.map(b =>
                b.id === id ? { ...b, status: "CANCELLED" } : b
              )
            );
          } else {
            const err = await res.json().catch(() => ({}));
            toast.error(err.msg || "Failed to cancel", {
              position: "top-center",
            });
          }
        } catch (e) {
          toast.error("Something went wrong", { position: "top-center" });
        }
      },
    },
  });
}

  const now = Date.now()
  const upcoming = bookings.filter(b =>
    (b.status === 'PENDING' || b.status === 'CONFIRMED')
    && new Date(b.end_datetime)
  )
  const completed = bookings.filter(b => b.status === 'COMPLETED')
  const cancelled = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='font-bold text-2xl'>My Bookings</h1>
        <p className='text-gray-500 text-sm'>Manage your upcoming and past appointments</p>
      </motion.div>

      <Tabs defaultValue='upcoming'>
        <TabsList variant='line' className='mb-5'>
          <TabsTrigger value='upcoming'>Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value='completed'>Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value='cancelled'>Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='upcoming'>
          {loading ? (
            <div className='animate-pulse space-y-3'>
              {[0, 1].map(i => (
                <div key={i} className='h-36 bg-white border border-gray-200 rounded-md' />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyTab label='upcoming' />
          ) : (
            <div className='flex flex-col gap-4'>
              <AnimatePresence>
                {upcoming.map((b, i) => (
                  <BookingCard key={b.id} b={b} idx={i} onCancel={cancel} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value='completed'>
          {completed.length === 0 ? (
            <EmptyTab label='completed' />
          ) : (
            <div className='flex flex-col gap-4'>
              {completed.map((b, i) => (
                <BookingCard key={b.id} b={b} idx={i} onCancel={cancel} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='cancelled'>
          {cancelled.length === 0 ? (
            <EmptyTab label='cancelled' />
          ) : (
            <div className='flex flex-col gap-4'>
              {cancelled.map((b, i) => (
                <BookingCard key={b.id} b={b} idx={i} onCancel={cancel} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
