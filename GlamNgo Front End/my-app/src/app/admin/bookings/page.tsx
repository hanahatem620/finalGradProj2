'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LuSearch } from 'react-icons/lu'

interface AdminBooking {
  id: number
  client_id: number
  client_name: string | null
  client_email: string
  provider_id: number
  provider_name: string | null
  provider_email: string
  start_datetime: string
  end_datetime: string
  status: string
  total_price: number
}

const statusTone: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const filters = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

function fmtDT(s: string) {
  try {
    return new Date(s).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return s }
}
function fmtTime(s: string) {
  try { return new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  catch { return s }
}

export default function AdminBookings() {
  const router = useRouter()
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.ok ? r.json() : [])
      .then(setBookings)
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    if (filter !== 'ALL' && b.status !== filter) return false
    if (q) {
      const term = q.toLowerCase()
      return (b.client_name || '').toLowerCase().includes(term)
        || (b.client_email || '').toLowerCase().includes(term)
        || (b.provider_name || '').toLowerCase().includes(term)
        || String(b.id).includes(term)
    }
    return true
  })

  return (
    <div className='px-4 lg:px-8 py-8 space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='text-3xl font-bold tracking-tight'>Bookings</h1>
        <p className='text-gray-500 text-sm mt-1'>
          {bookings.length} total — click any row to open the full booking.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className='flex flex-wrap gap-2 items-center'
      >
        <div className='flex gap-1 bg-white border border-gray-200 rounded-full p-1'>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-full transition ${
                filter === f
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f} ({f === 'ALL' ? bookings.length : bookings.filter(b => b.status === f).length})
            </button>
          ))}
        </div>
        <div className='flex-1 min-w-[220px] relative'>
          <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <Input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder='Search by client, provider, or #id'
            className='pl-9'
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'
      >
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='p-8 animate-pulse space-y-2'>
              {[0, 1, 2, 3].map(i => <div key={i} className='h-10 bg-gray-100 rounded' />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              No bookings match this filter.
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 text-gray-600 text-xs uppercase'>
                <tr>
                  <th className='px-4 py-3 text-left'>#</th>
                  <th className='px-4 py-3 text-left'>Client</th>
                  <th className='px-4 py-3 text-left'>Provider</th>
                  <th className='px-4 py-3 text-left'>Start</th>
                  <th className='px-4 py-3 text-left'>End</th>
                  <th className='px-4 py-3 text-left'>Status</th>
                  <th className='px-4 py-3 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr
                    key={b.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => router.push(`/admin/bookings/${b.id}`)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push(`/admin/bookings/${b.id}`)
                      }
                    }}
                    className='border-t border-gray-100 hover:bg-pink-50/40 cursor-pointer transition focus:bg-pink-50/60 focus:outline-none'
                  >
                    <td className='px-4 py-3 text-gray-400'>#{b.id}</td>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{b.client_name || b.client_email?.split('@')[0]}</div>
                      <div className='text-xs text-gray-400'>{b.client_email}</div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{b.provider_name || b.provider_email?.split('@')[0]}</div>
                      <div className='text-xs text-gray-400'>{b.provider_email}</div>
                    </td>
                    <td className='px-4 py-3 text-gray-600'>{fmtDT(b.start_datetime)}</td>
                    <td className='px-4 py-3 text-gray-500'>{fmtTime(b.end_datetime)}</td>
                    <td className='px-4 py-3'>
                      <Badge className={statusTone[b.status] || 'bg-gray-100'}>{b.status}</Badge>
                    </td>
                    <td className='px-4 py-3 text-right font-semibold'>
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
  )
}
