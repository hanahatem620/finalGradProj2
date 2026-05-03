'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LuCalendarCheck2 } from 'react-icons/lu'
import { FaStar } from 'react-icons/fa6'
import { FiClock } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUser } from '@/profileActions/getUser.action'
import type { User } from '@/types/user.type'
import { BookingRow } from '@/types/bookingRow.type'

const statusColor: Record<string, string> = {
  PENDING:   'text-yellow-600 bg-yellow-100 py-1 px-4 h-fit',
  CONFIRMED: 'text-green-600 bg-green-100 py-1 px-4 h-fit',
  COMPLETED: 'text-green-600 bg-green-100 py-1 px-4 h-fit',
  CANCELLED: 'text-red-600 bg-red-100 py-1 px-4 h-fit'
}

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString(undefined, {
      weekday: 'short', day: 'numeric', month: 'short',
    })
  } catch { return s }
}
function formatRange(start: string, end: string) {
  try {
    const s = new Date(start), e = new Date(end)
    const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${fmt(s)} – ${fmt(e)}`
  } catch { return `${start} – ${end}` }
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const u = await getUser()
        if (!cancelled) setUser(u as any)
        const res = await fetch('/api/me/bookings')
        if (res.ok) {
          const rows: BookingRow[] = await res.json()
          if (!cancelled) setBookings(rows)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const now = Date.now()
  const upcoming = bookings.filter(b =>
   (b.status === 'PENDING' || b.status === 'CONFIRMED')
  ).slice(0, 4)
  const history = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
                          .slice(0, 4)
  const totalBookings = bookings.length
  const loyaltyPts = bookings.filter(b => b.status === 'COMPLETED').length * 50

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-8'>
      {/* Greeting + stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className='text-3xl font-bold mb-5'>
          Hello, <span className='text-pink-500'>{user?.name ?? '…'}</span>! Ready to glow?
        </h1>
        <div className='flex flex-wrap gap-3'>
          {[
            { label: 'Total Bookings', value: totalBookings, icon: <LuCalendarCheck2 /> },
            { label: 'Loyalty Points', value: `${loyaltyPts}`, suffix: 'pts', icon: <FaStar /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              custom={i}
              whileHover={{ y: -3 }}
              className='bg-white shadow-sm w-fit p-5 border border-gray-200 rounded-lg flex gap-3 min-w-42.5'
            >
              <div>
                <p className='text-gray-500 text-sm'>{s.label}</p>
                <h1 className='font-bold text-2xl'>
                  {s.value} {s.suffix && <span className='font-normal text-sm'>{s.suffix}</span>}
                </h1>
              </div>
              <div className='bg-pink-100 p-2 rounded-md h-fit text-pink-500 text-2xl'>
                {s.icon}
              </div>
            </motion.div>
          ))}

          <motion.div
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            custom={2}
            whileHover={{ scale: 1.02 }}
            className='bg-linear-to-br from-pink-400 to-pink-500 shadow-md w-fit pt-4 pb-5 px-6 rounded-lg flex flex-col gap-2 text-white'
          >
            <div>
              <h1 className='font-bold'>New Offer</h1>
              <p className='max-w-48 text-sm opacity-90'>Get 20% off your next facial.</p>
            </div>
            <Link href='/client/claimNow'>
              <Button className='bg-white text-pink-600 hover:bg-pink-50 w-fit'>Claim Now</Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Upcoming */}
      <div>
        <div className='flex justify-between items-baseline mb-4'>
          <h2 className='text-2xl font-bold'>Upcoming Bookings</h2>
          <Link href='/client/booking' className='text-pink-500 text-sm'>View all &gt;</Link>
        </div>
        {loading && (
          <div className='flex gap-4'>
            {[0, 1].map(i => (
              <div key={i} className='animate-pulse bg-white border border-gray-200 rounded-md h-40 w-full max-w-md' />
            ))}
          </div>
        )}
        {!loading && upcoming.length === 0 && (
          <div className='bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500'>
            No upcoming bookings. <Link href='/artists' className='text-pink-500 font-semibold'>Find an artist</Link>
          </div>
        )}
        <div className='flex flex-wrap gap-4'>
          {upcoming.map((b, i) => (
            <motion.div
              key={b.id}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              custom={i}
              whileHover={{ y: -3 }}
              className='bg-white shadow-sm border border-gray-100 rounded-lg w-full sm:max-w-md p-4'
            >
              <div className='flex justify-between'>
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
                    <h1 className='text-base font-bold'>{b.provider_name}</h1>
                    <p className='text-xs text-pink-500 font-semibold'>
                      {b.provider_role === 'artist' ? 'Makeup Artist' : 'Hair Stylist'}
                    </p>
                  </div>
                </div>
                <Badge className={statusColor[b.status]}>{b.status.toLowerCase()}</Badge>
              </div>
              <div className='mt-4 space-y-1 text-sm'>
                <h2 className='flex items-center gap-1 text-gray-500'>
                  <LuCalendarCheck2 /> {formatDate(b.start_datetime)}, {formatRange(b.start_datetime, b.end_datetime)}
                </h2>
                <h2 className='flex items-center gap-1 text-gray-500'>
                  <FiClock /> EGP {b.total_price.toFixed(2)}
                </h2>
              </div>
              <Link href='/client/booking' className='block mt-3'>
                <Button className='bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-md w-full'>
                  Manage Booking
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold mb-4'>Recent History</h2>
          <div className='flex flex-col gap-3'>
            {history.map((b, i) => (
              <motion.div
                key={b.id}
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                custom={i}
                className='bg-white border border-gray-100 shadow-sm rounded-lg p-4'
              >
                <div className='flex justify-between items-center flex-wrap gap-3'>
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
                      <h1 className='text-base font-bold'>{b.provider_name}</h1>
                      <p className='text-xs text-gray-500'>{formatDate(b.start_datetime)}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    {b.status === 'COMPLETED' && !b.reviewed && (
                      <Link href={`/client/leaveReview?booking=${b.id}`}>
                        <Button variant='outline'>Leave Review</Button>
                      </Link>
                    )}
                    {b.status === 'COMPLETED' && b.reviewed && (
                      <Badge className='bg-gray-100 text-gray-600'>Review submitted</Badge>
                    )}
                    <Link href={`/artistPortfolio?id=${b.provider_id}`}>
                      <Button className='bg-pink-500 hover:bg-pink-600'>Rebook</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
