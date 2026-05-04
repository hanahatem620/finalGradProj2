'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

const POLL_MS = 30_000

function timeAgo(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  const diff = Math.max(0, Date.now() - t)
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d ago`
  return new Date(t).toLocaleDateString()
}

export default function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const seenIds = useRef<Set<number> | null>(null)
  const router = useRouter()

  async function fetchNotifications(silent: boolean) {
    try {
      const r = await fetch('/api/notification', { cache: 'no-store' })
      if (!r.ok) return
      const data: ApiPayload = await r.json()
      setItems(data.notifications || [])
      setUnread(data.unread_count || 0)
      

      if (seenIds.current === null) {
        // first load — prime the set, no toasts
        seenIds.current = new Set((data.notifications || []).map(n => n.id))
        return
      }
      if (!silent) return

      // toast for any newly arrived unread items
      const fresh = (data.notifications || []).filter(
        n => !seenIds.current!.has(n.id) && !n.is_read
      )
      if (fresh.length) {
        for (const n of fresh.slice(0, 3)) {
          toast(n.title, { description: n.body })
        }
        for (const n of fresh) seenIds.current!.add(n.id)
      }
    } catch {
      /* swallow — bell is non-critical */
    }
  }

  useEffect(() => {
    fetchNotifications(false)
    const id = setInterval(() => fetchNotifications(true), POLL_MS)
    const onFocus = () => fetchNotifications(true)
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  async function markRead(id: number) {
    setItems(list => list.map(n => (n.id === id ? { ...n, is_read: 1 } : n)))
    setUnread(u => Math.max(0, u - 1))
    try {
      await fetch('/api/notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch {
      /* re-fetch will reconcile */
    }
  }

  async function markAllRead() {
    if (!unread) return
    setItems(list => list.map(n => ({ ...n, is_read: 1 })))
    setUnread(0)
    try {
      await fetch('/api/notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
    } catch {
      /* ignore */
    }
  }

  async function handleClick(n: NotificationItem) {
    if (!n.is_read) await markRead(n.id)
    setOpen(false)
    if (n.action_url) router.push(n.action_url)
  }

  const preview = items.slice(0, 8)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label='Notifications'
          className='relative rounded-full p-2 hover:bg-pink-50 transition cursor-pointer'
        >
          <Bell className='w-5 h-5 text-gray-700' />
          {unread > 0 && (
            <span className='absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center'>
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80 p-0'>
        <div className='flex items-center justify-between px-3 py-2 border-b'>
          <span className='font-semibold text-sm'>Notifications</span>
          <button
            type='button'
            onClick={markAllRead}
            disabled={unread === 0}
            className='text-xs text-pink-600 hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer'
          >
            Mark all read
          </button>
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {preview.length === 0 && (
            <div className='px-4 py-8 text-center text-sm text-gray-500'>
              No notifications yet
            </div>
          )}
          {preview.map(n => (
            <button
              key={n.id}
              type='button'
              onClick={() => handleClick(n)}
              className={`w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-pink-50 transition cursor-pointer ${
                n.is_read ? 'bg-white' : 'bg-pink-50/40'
              }`}
            >
              <div className='flex items-start gap-2'>
                {!n.is_read && (
                  <span className='mt-1.5 w-2 h-2 rounded-full bg-pink-500 shrink-0' />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-semibold text-gray-900 truncate'>
                    {n.title}
                  </div>
                  <div className='text-xs text-gray-600 line-clamp-2'>
                    {n.body}
                  </div>
                  <div className='text-[11px] text-gray-400 mt-0.5'>
                    {timeAgo(n.created_at)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className='border-t px-3 py-2 text-center'>
          <Link
            href='/notifications'
            onClick={() => setOpen(false)}
            className='text-xs text-pink-600 hover:underline'
          >
            View all
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
