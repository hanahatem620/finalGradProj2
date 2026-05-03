'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Send, RefreshCw, Search, Inbox, Clock, CheckCircle2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket } from '@/types/tickets.type'
import { Badge } from '@/components/ui/badge'

// ── Constants ──────────────────────────────────────────────────────────────
const POLL_INTERVAL = 5000

const STATUS_STYLE: Record<Ticket['status'], string> = {
  OPEN:        'bg-red-100 text-red-600',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  CLOSED:      'bg-green-100 text-green-700',
}

const STATUS_ICON: Record<Ticket['status'], ReactNode> = {
  OPEN:        <Inbox className='size-4 mr-1' />,
  IN_PROGRESS: <Clock className='size-4 mr-1' />,
  CLOSED:      <CheckCircle2 className='size-4 mr-1' />,
}

const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED'] as const

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return s }
}

function getClientName(ticket: Ticket) {
  const firstClientMsg = ticket.messages.find(m => m.sender_type === 'CLIENT')
  return firstClientMsg?.sender_name || 'Client'
}

// ══════════════════════════════════════════════════════════════════════════
export default function AdminTickets() {
  const [tickets, setTickets]       = useState<Ticket[]>([])
  const [loading, setLoading]       = useState(true)
  const [openId, setOpenId]         = useState<number | null>(null)
  const [filter, setFilter]         = useState('ALL')
  const [search, setSearch]         = useState('')
  const [reply, setReply]           = useState('')
  const [replyingId, setReplyingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const isMounted = useRef(true)
  const pollRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Data fetching ──────────────────────────────────────────────────────
  // ✅ FIX 1 — was using POST to list tickets, should be GET
  async function load(silent = false) {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/support')  // GET — no method or body needed
      if (res.ok) {
        const data: Ticket[] = await res.json()
        if (isMounted.current) setTickets(data)
      }
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    isMounted.current = true
    load()
    pollRef.current = setInterval(() => load(true), POLL_INTERVAL)
    return () => {
      isMounted.current = false
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const chatEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tickets, openId])

  // ── Reply ──────────────────────────────────────────────────────────────
  async function sendReply(ticketId: number) {
    const text = reply.trim()
    if (!text) return
    setReplyingId(ticketId)
    try {
      const res = await fetch(`/api/support/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ FIX 2 — removed senderType/senderName from body
        // The API already reads the session role server-side to set sender_type.
        // Sending it from the client is both redundant and a security hole.
        body: JSON.stringify({ body: text }),
      })
      if (res.ok) {
        setReply('')
        await load(true)
        toast.success('Reply sent', { position: 'top-center' })
      } else {
        toast.error('Failed to send reply', { position: 'top-center' })
      }
    } finally {
      setReplyingId(null)
    }
  }

  // ── Status update ──────────────────────────────────────────────────────
  async function updateStatus(ticketId: number, status: string) {
    setUpdatingId(ticketId)
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        await load(true)
        toast.success(
          `Ticket marked as ${status.toLowerCase().replace('_', ' ')}`,
          { position: 'top-center' }
        )
      } else {
        toast.error('Failed to update status', { position: 'top-center' })
      }
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Derived data ───────────────────────────────────────────────────────
  const filtered = tickets.filter(t => {
    if (filter !== 'ALL' && t.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (t.title || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        t.messages.some(m => (m.sender_name || '').toLowerCase().includes(q)) ||
        String(t.id).includes(q)
    }
    return true
  })

  const counts = {
    ALL:         tickets.length,
    OPEN:        tickets.filter(t => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    CLOSED:      tickets.filter(t => t.status === 'CLOSED').length,
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 space-y-6'>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center justify-between flex-wrap gap-4'
      >
        <div>
          <h1 className='font-bold text-3xl tracking-tight text-gray-900'>Support Tickets</h1>
          <p className='text-gray-500 text-sm mt-1'>
            {tickets.length} total ticket{tickets.length !== 1 ? 's' : ''} — auto-refreshes every 5s
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => load(false)}
          className='flex items-center gap-2'
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </motion.div>

      {/* ── Filters + Search ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className='flex flex-wrap gap-4 items-center'
      >
        <div className='flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm'>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-md transition font-medium ${
                filter === f
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'IN_PROGRESS' ? 'In Progress' : f} ({counts[f]})
            </button>
          ))}
        </div>

        <div className='relative flex-1 min-w-75'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4' />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search by title, description, or client...'
            className='pl-10'
          />
        </div>
      </motion.div>

      {/* ── Ticket List ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='space-y-3'
      >
        {loading && tickets.length === 0 && (
          <div className='space-y-3'>
            {[0, 1, 2].map(i => (
              <div key={i} className='h-16 bg-white rounded-xl border border-gray-100 animate-pulse' />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 &&(
          <div className='bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-500'>
            No tickets match your filters.
          </div>
        )}

        {filtered.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'
          >
            {/* ── Ticket row ─────────────────────────────────────────── */}
            <button
              onClick={() => setOpenId(openId === t.id ? null : t.id)}
              className='w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-pink-50/20 transition'
            >
              <span className='text-gray-400 font-mono text-xs shrink-0 w-16'>
                #{t.id.toString().padStart(6, '0')}
              </span>

              <Badge className='bg-gray-100 text-gray-700 shrink-0'>
                {t.category}
              </Badge>

              <Badge className={`${STATUS_STYLE[t.status]} shrink-0 flex items-center`}>
                {STATUS_ICON[t.status]}
                {t.status === 'IN_PROGRESS' ? 'In Progress' : t.status}
              </Badge>

              <span className='font-semibold text-gray-900 text-sm flex-1 truncate'>
                {t.title || t.description}
              </span>

              <span className='text-xs text-gray-500 hidden sm:block w-32 truncate text-right'>
                {getClientName(t)}
              </span>

              {t.messages.length > 0 && (
                <span className='bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0'>
                  {t.messages.length} msg
                </span>
              )}

              <span className='text-xs text-gray-400 shrink-0 hidden md:block w-32 text-right'>
                {fmtDate(t.created_at)}
              </span>

              <ChevronDown
                className={`text-gray-400 size-4 transition-transform shrink-0 ${
                  openId === t.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* ── Expanded detail ─────────────────────────────────────── */}
            <AnimatePresence>
              {openId === t.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden border-t border-gray-100'
                >
                  <div className='p-5 space-y-6'>

                    {/* Meta + status controls */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div className='bg-gray-50 rounded-lg p-3'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>
                          Description
                        </p>
                        <p className='text-gray-700 leading-relaxed font-medium'>
                          {t.description}
                        </p>
                      </div>

                      <div className='flex flex-col justify-end gap-3'>
                        {t.status !== 'CLOSED' && (
                          <div className='flex gap-2 flex-wrap'>
                            {t.status === 'OPEN' && (
                              <Button
                                size='sm'
                                variant='outline'
                                disabled={updatingId === t.id}
                                onClick={() => updateStatus(t.id, 'IN_PROGRESS')}
                                className='border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                              >
                                Mark In Progress
                              </Button>
                            )}
                            <Button
                              size='sm'
                              variant='outline'
                              disabled={updatingId === t.id}
                              onClick={() => updateStatus(t.id, 'CLOSED')}
                              className='border-green-200 text-green-700 hover:bg-green-50'
                            >
                              Close Ticket
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Chat thread ─────────────────────────────────── */}
                    <div className='bg-gray-50/80 rounded-xl p-4 flex flex-col gap-3 max-h-100 overflow-y-auto border border-gray-100'>

                      {/* Original client message */}
                      <div className='flex justify-end'>
                        <div className='bg-pink-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm max-w-[85%] shadow-sm'>
                          <p className='text-[10px] font-bold opacity-80 mb-1 uppercase tracking-wider'>
                            {getClientName(t)} · Original Request
                          </p>
                          {t.description}
                        </div>
                      </div>

                      {/* All messages */}
                      {(t.messages || []).map(m => (
                        <div
                          key={m.id}
                          className={`flex ${
                            m.sender_type === 'CLIENT' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] shadow-sm ${
                              m.sender_type === 'CLIENT'
                                ? 'bg-pink-500 text-white rounded-tr-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p
                              className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${
                                m.sender_type === 'CLIENT' ? 'opacity-80' : 'opacity-60'
                              }`}
                            >
                              {m.sender_type === 'ADMIN'
                                ? `Support (${m.sender_name || 'Admin'})`
                                : getClientName(t)}
                              <span className='mx-1'>·</span>
                              {fmtDate(m.created_at)}
                            </p>
                            {m.body}
                          </div>
                        </div>
                      ))}

                      {/* ✅ FIX 3 — duplicate <div ref={chatEndRef} /> removed */}
                      <div ref={chatEndRef} />
                    </div>

                    {/* ── Reply box ───────────────────────────────────── */}
                    {t.status !== 'CLOSED' ? (
                      <div className='flex gap-3'>
                        <Input
                          placeholder='Type your reply message...'
                          // ✅ FIX 2 (part 2) — guard value so typing in one
                          // ticket doesn't bleed into another when you switch
                          value={openId === t.id ? reply : ''}
                          onChange={e => setReply(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              sendReply(t.id)
                            }
                          }}
                          className='bg-white shadow-sm'
                        />
                        <Button
                          className='shrink-0 gap-2 bg-pink-500 hover:bg-pink-600'
                          disabled={replyingId === t.id || !reply.trim()}
                          onClick={() => sendReply(t.id)}
                        >
                          <Send size={16} />
                          {replyingId === t.id ? 'Sending...' : 'Send Reply'}
                        </Button>
                      </div>
                    ) : (
                      <div className='text-center p-4 rounded-lg bg-gray-100/50 border border-dashed border-gray-200'>
                        <p className='text-sm text-gray-500 italic'>
                          This ticket is closed. You cannot send replies.
                        </p>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}