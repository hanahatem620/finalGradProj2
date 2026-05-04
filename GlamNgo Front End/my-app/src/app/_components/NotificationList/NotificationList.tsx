'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationItem {
  id: number
  user_id: number
  type: string
  title: string
  body: string
  is_read: number
  action_url: string | null
  created_at: string
}

interface ApiPayload {
  unread_count: number
  notifications: NotificationItem[]
}

function bucket(iso: string): 'today' | 'yesterday' | 'thisWeek' | 'earlier' {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return 'earlier'
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const today0 = new Date()
  today0.setHours(0, 0, 0, 0)
  const todayStart = today0.getTime()
  if (t >= todayStart) return 'today'
  if (t >= todayStart - day) return 'yesterday'
  if (t >= now - 7 * day) return 'thisWeek'
  return 'earlier'
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const TYPE_STYLES: Record<string, { bg: string; fg: string }> = {
  BOOKING_NEW: { bg: 'bg-yellow-100', fg: 'text-yellow-600' },
  BOOKING_CANCELLED: { bg: 'bg-red-100', fg: 'text-red-600' },
  BOOKING_COMPLETED: { bg: 'bg-green-100', fg: 'text-green-600' },
  PAYMENT_RECEIVED: { bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  REVIEW_NEW: { bg: 'bg-blue-100', fg: 'text-blue-600' },
  SUPPORT_REPLY: { bg: 'bg-purple-100', fg: 'text-purple-600' },
  SYSTEM: { bg: 'bg-pink-100', fg: 'text-pink-600' },
}

export default function NotificationsList() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState(0)
  const router = useRouter()

  async function load() {
    try {
      const r = await fetch('/api/notification', { cache: 'no-store' })
      if (!r.ok) {
        setItems([])
        setLoading(false)
        return
      }
      const data: ApiPayload = await r.json()
      setItems(data.notifications || [])
      setUnread(data.unread_count || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function markRead(id: number) {
    setItems(list => list.map(n => (n.id === id ? { ...n, is_read: 1 } : n)))
    setUnread(u => Math.max(0, u - 1))
    await fetch('/api/notification', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function markAll() {
    if (!unread) return
    setItems(list => list.map(n => ({ ...n, is_read: 1 })))
    setUnread(0)
    await fetch('/api/notification', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
  }

  async function remove(id: number) {
    const target = items.find(n => n.id === id)
    setItems(list => list.filter(n => n.id !== id))
    if (target && !target.is_read) setUnread(u => Math.max(0, u - 1))
    await fetch('/api/notification', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function open(n: NotificationItem) {
    if (!n.is_read) await markRead(n.id)
    if (n.action_url) router.push(n.action_url)
  }

  const groups: Record<string, NotificationItem[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: [],
  }
  for (const n of items) groups[bucket(n.created_at)].push(n)

  const groupTitles: { key: keyof typeof groups; label: string }[] = [
    { key: 'today', label: 'TODAY' },
    { key: 'yesterday', label: 'YESTERDAY' },
    { key: 'thisWeek', label: 'THIS WEEK' },
    { key: 'earlier', label: 'EARLIER' },
  ]

  if (loading) {
    return (
      <div className='py-20 text-center text-gray-500'>Loading...</div>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl'>Notifications</h1>
          <p className='text-gray-500 text-sm mt-1'>
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <Button
          onClick={markAll}
          disabled={unread === 0}
          variant='outline'
          className='border-pink-300 text-pink-600 hover:bg-pink-50'
        >
          <Check className='w-4 h-4 me-1' />
          Mark all read
        </Button>
      </div>

      {items.length === 0 && (
        <div className='border border-dashed border-gray-300 rounded-md p-12 text-center'>
          <Bell className='w-10 h-10 text-gray-300 mx-auto mb-3' />
          <p className='text-gray-500'>You don&apos;t have any notifications yet</p>
        </div>
      )}

      {groupTitles.map(({ key, label }) => {
        const list = groups[key]
        if (!list || list.length === 0) return null
        return (
          <div key={key}>
            <h3 className='font-semibold text-gray-500 text-sm mb-3'>{label}</h3>
            <div className='flex flex-col gap-2'>
              {list.map(n => {
                const style = TYPE_STYLES[n.type] ?? TYPE_STYLES.SYSTEM
                return (
                  <div
                    key={n.id}
                    className={`border rounded-md shadow-sm p-5 flex gap-3 ${
                      n.is_read
                        ? 'border-gray-200 bg-white'
                        : 'border-pink-200 bg-pink-50/40'
                    }`}
                  >
                    <div
                      className={`${style.bg} ${style.fg} w-fit h-fit p-2 rounded-full shrink-0`}
                    >
                      <Bell className='text-lg w-5 h-5' />
                    </div>
                    <div
                      className='flex-1 min-w-0 cursor-pointer'
                      onClick={() => open(n)}
                    >
                      <div className='flex items-center gap-2'>
                        <h2 className='font-bold'>{n.title}</h2>
                        {!n.is_read && (
                          <span className='w-2 h-2 rounded-full bg-pink-500' />
                        )}
                      </div>
                      <p className='text-gray-600 mt-1'>{n.body}</p>
                      <p className='text-gray-400 text-sm mt-1'>
                        {fmtTime(n.created_at)}
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => remove(n.id)}
                      aria-label='Delete notification'
                      className='self-start text-gray-300 hover:text-red-500 transition cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
