'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { LuUsers, LuCalendarCheck2 } from 'react-icons/lu'
import { FaStar, FaMoneyBillWave } from 'react-icons/fa6'
import { HiOutlineUsers } from 'react-icons/hi2'
import { AdminBooking, DashStats } from '@/types/adminBooking.type'
import { LuPalette } from "react-icons/lu";


const statusTone: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashStats | null>(null)
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, b] = await Promise.all([
          fetch('/api/admin/dashboard').then(r => r.ok ? r.json() : null),
          fetch('/api/admin/bookings').then(r => r.ok ? r.json() : []),
        ])
        if (!cancelled) { setStats(s); setBookings(b) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const cards = [
    { label: 'Total Artists', value: stats?.total_providers ?? '…', icon: <LuPalette />, },
    { label: 'Total Users', value: stats?.total_users ?? '…', icon: <LuUsers />, },
    { label: 'Clients', value: stats?.total_clients ?? '…', icon: <HiOutlineUsers />,  },
    // { label: 'Providers', value: stats?.total_providers ?? '…', icon: <FaStar />, bg: 'from-amber-400 to-amber-500' },
    { label: 'Bookings', value: stats?.total_bookings ?? '…', icon: <LuCalendarCheck2 />,  },
    { label: 'Revenue', value: stats ? `EGP ${stats.total_revenue.toFixed(0)}` : '…', icon: <FaMoneyBillWave />,  },
  ]

  const now = Date.now()
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length
  const upcomingCount = bookings.filter(b =>
    b.status !== 'CANCELLED' && new Date(b.start_datetime).getTime() >= now
  ).length
  const avgValue = bookings.length
    ? bookings.reduce((s, b) => s + b.total_price, 0) / bookings.length
    : 0

  return (

    <>
   <div>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>
      <div className='flex flex-wrap flex-col gap-4'>
        
      {/* Header — left aligned */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-pink-500  mt-1'>
          Here's what's happening today in your business
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className='flex flex-wrap gap-4 '>
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            custom={i}
            whileHover={{ y: -4 }}
            className={`rounded-xl p-5 shadow-lg`}
          >
            <div className='flex items-start justify-between'>
              <div>
                <div className='text-xs opacity-90 uppercase '>{c.label}</div>
                <div className='text-2xl font-bold mt-1'>{c.value}</div>
              </div>
              <div className='text-2xl ms-1 bg-pink-200 p-2 rounded-md text-pink-500'>{c.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className='flex flex-wrap lg:flex-row flex-col gap-4'
      >
        <div className='pendings bg-white rounded-xl p-5 border border-gray-100 shadow-sm lg:flex-1 w-md '>
          <div className='text-xs text-gray-500 uppercase'>Pending today</div>
          <div className='text-3xl font-bold text-yellow-600 mt-1'>{pendingCount}</div>
          <div className='text-xs text-gray-400'>awaiting confirmation</div>
        </div>

        <div className='upcoming bg-white rounded-xl p-5 border border-gray-100 shadow-sm lg:flex-1 w-md'>
          <div className='text-xs text-gray-500 uppercase'>Upcoming</div>
          <div className='text-3xl font-bold text-green-600 mt-1'>{upcomingCount}</div>
          <div className='text-xs text-gray-400'>appointments ahead</div>
        </div>

        <div className='avgBook bg-white rounded-xl p-5 border border-gray-100 shadow-sm lg:flex-1 w-md'>
          <div className='text-xs text-gray-500 uppercase'>Avg. booking value</div>
          <div className='text-3xl font-bold text-pink-500 mt-1'>
            {avgValue ? `EGP ${avgValue.toFixed(0)}` : '—'}
          </div>
          <div className='text-xs text-gray-400'>across all bookings</div>
        </div>
      </motion.div>

      {/* Recent bookings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className='rounded-xl border border-gray-100 shadow-sm lg:w-full w-md'
      >
        <div className='px-5 py-3 border-b border-gray-100 flex items-center justify-between'>
          <h2 className='font-bold text-lg'>Recent Bookings</h2>
          <Link href='/admin/bookings' className='text-pink-500 text-sm hover:text-pink-600'>
            View all →
          </Link>
        </div>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='p-6 animate-pulse space-y-2'>
              {[0, 1, 2].map(i => <div key={i} className='h-10 bg-gray-100 rounded' />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className='p-10 text-center text-gray-500'>No bookings yet.</div>
          ) : (
            <table className='lg:w-full  text-sm'>
              <thead className='bg-gray-50 text-gray-600 text-xs uppercase'>
                <tr>
                  <th className='px-4 py-2 text-left'>#</th>
                  <th className='px-4 py-2 text-left'>Client</th>
                  <th className='px-4 py-2 text-left'>Provider</th>
                  <th className='px-4 py-2 text-left'>When</th>
                  <th className='px-4 py-2 text-left'>Status</th>
                  <th className='px-4 py-2 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map(b => (
                  <tr key={b.id} className='border-t border-gray-100 hover:bg-gray-50'>
                    <td className='px-4 py-2 text-gray-400'>#{b.id}</td>
                    <td className='px-4 py-2'>{b.client_name || b.client_email?.split('@')[0]}</td>
                    <td className='px-4 py-2'>{b.provider_name || b.provider_email?.split('@')[0]}</td>
                    <td className='px-4 py-2 text-gray-500'>
                      {new Date(b.start_datetime).toLocaleString([], {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className='px-4 py-2'>
                      <Badge className={statusTone[b.status] || 'bg-gray-100'}>{b.status}</Badge>
                    </td>
                    <td className='px-4 py-2 text-right font-semibold'>
                      EGP {b.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
    </div>
   </div>
    
    </>
  )
}
