'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoCallOutline } from 'react-icons/io5'
import { FaRegEnvelope } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { FiPlus, FiSend } from 'react-icons/fi'

interface TicketMessage {
  id: number
  sender_type: 'CLIENT' | 'ADMIN'
  sender_name: string | null
  body: string
  created_at: string
}

interface Ticket {
  id: number
  title: string | null
  category: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  created_at: string
  resolved_at: string | null
  messages: TicketMessage[]
}

const statusTone: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-600',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  CLOSED: 'bg-green-100 text-green-700',
}

export default function HelpCenter() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<number | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  // new-ticket form state
  const [nTitle, setNTitle] = useState('')
  const [nCategory, setNCategory] = useState('Booking Issue')
  const [nDescription, setNDescription] = useState('')

  // reply state (per open ticket)
  const [reply, setReply] = useState('')
  const [replyingId, setReplyingId] = useState<number | null>(null)

  async function load() {
    try {
      const res = await fetch('/api/support')
      if (res.ok) setTickets(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createTicket() {
    if (!nCategory || !nDescription.trim()) {
      toast.error('Category and description required', { position: 'top-center' })
      return
    }
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: nTitle, category: nCategory, description: nDescription }),
    })
    if (res.ok) {
      toast.success('Ticket submitted — we will get back to you soon', { position: 'top-center' })
      setNewOpen(false); setNTitle(''); setNDescription('')
      load()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.msg || 'Failed to create ticket', { position: 'top-center' })
    }
  }

  async function sendReply(ticketId: number) {
    if (!reply.trim()) return
    setReplyingId(ticketId)
    const res = await fetch(`/api/support/${ticketId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: reply }),
    })
    setReplyingId(null)
    if (res.ok) {
      setReply('')
      load()
    } else {
      toast.error('Failed to send reply', { position: 'top-center' })
    }
  }

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-6'>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='font-bold text-3xl'>Help Center</h1>
        <p className='text-gray-500'>Find answers to common questions and get support</p>
      </motion.div>

      {/* Contact cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className='shadow-sm border border-gray-100 rounded-lg p-4 flex flex-col items-center gap-1 bg-white'>
          <div className='bg-pink-100 w-fit p-4 rounded-full text-pink-500'>
            <FaRegEnvelope className='text-lg' />
          </div>
          <h1 className='font-bold text-xl'>Email Support</h1>
          <p className='text-gray-500 text-sm'>Get help via email</p>
          <a href='mailto:support@glamngo.com'>
            <Button className='bg-pink-500 hover:bg-pink-600 text-white font-semibold'>
              Send email
            </Button>
          </a>
        </div>
        <div className='shadow-sm border border-gray-100 rounded-lg p-4 flex flex-col items-center gap-1 bg-white'>
          <div className='bg-pink-100 w-fit p-4 rounded-full text-pink-500'>
            <IoCallOutline className='text-lg' />
          </div>
          <h1 className='font-bold text-xl'>Phone Support</h1>
          <p className='text-gray-500 text-sm'>Call us for assistance</p>
          <p className='font-semibold text-pink-500'>1-800-GLAM-NOW</p>
        </div>
      </motion.div>

      {/* My tickets */}
      <div className='bg-white shadow-sm border border-gray-100 rounded-lg p-5'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='font-bold text-xl'>My Tickets</h2>
            <p className='text-sm text-gray-500'>
              {tickets.length} ticket{tickets.length === 1 ? '' : 's'} on file
            </p>
          </div>
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button className='bg-pink-500 hover:bg-pink-600'>
                <FiPlus className='me-1' /> New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Open a new support ticket</DialogTitle>
                <DialogDescription>
                  Tell us what's going on — we usually reply within a few hours.
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-semibold'>Title</label>
                  <Input
                    placeholder='Brief summary'
                    value={nTitle}
                    onChange={e => setNTitle(e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div>
                  <label className='text-sm font-semibold'>Category</label>
                  <select
                    value={nCategory}
                    onChange={e => setNCategory(e.target.value)}
                    className='w-full border border-gray-300 rounded-md p-2 text-sm'
                  >
                    <option>Booking Issue</option>
                    <option>Payment</option>
                    <option>Provider Complaint</option>
                    <option>Technical Problem</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className='text-sm font-semibold'>Description</label>
                  <Textarea
                    placeholder='Describe your issue in detail...'
                    value={nDescription}
                    onChange={e => setNDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button className='bg-pink-500 hover:bg-pink-600 w-full' onClick={createTicket}>
                  Submit Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading && (
          <div className='animate-pulse space-y-2'>
            {[0, 1].map(i => (
              <div key={i} className='h-14 bg-gray-100 rounded-md' />
            ))}
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className='text-center text-gray-500 py-8 border border-dashed border-gray-200 rounded-md'>
            No tickets yet. Click <strong>New Ticket</strong> to report an issue.
          </div>
        )}

        <div className='flex flex-col gap-2'>
          {tickets.map((t, i) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className='border border-gray-100 rounded-lg'
            >
              <button
                onClick={() => setOpenId(openId === t.id ? null : t.id)}
                className='w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg'
              >
                <span className='text-gray-400 font-mono text-xs'>
                  #{t.id.toString().padStart(6, '0')}
                </span>
                <Badge className='bg-gray-100 text-gray-700'>{t.category}</Badge>
                <Badge className={statusTone[t.status]}>{t.status}</Badge>
                <span className='font-semibold text-sm flex-1 truncate'>
                  {t.title || t.description.slice(0, 60)}
                </span>
                <span className='text-xs text-gray-500'>
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openId === t.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className='overflow-hidden'
                  >
                    <div className='border-t border-gray-100 p-3 space-y-2'>
                      <div className='flex justify-end'>
                        <div className='bg-pink-500 text-white rounded-xl px-3 py-2 text-sm max-w-[80%]'>
                          <div className='text-[10px] opacity-75'>You</div>
                          {t.description}
                        </div>
                      </div>

                      {t.messages?.map(m => (
                        <div key={m.id} className={`flex ${m.sender_type === 'CLIENT' ? 'justify-end' : 'justify-start'}`}>
                          <div className={
                            m.sender_type === 'CLIENT'
                              ? 'bg-pink-500 text-white rounded-xl px-3 py-2 text-sm max-w-[80%]'
                              : 'bg-gray-100 text-gray-800 rounded-xl px-3 py-2 text-sm max-w-[80%]'
                          }>
                            <div className='text-[10px] opacity-75'>
                              {m.sender_type === 'ADMIN' ? 'Support' : 'You'}
                            </div>
                            {m.body}
                          </div>
                        </div>
                      ))}

                      {t.status !== 'CLOSED' && (
                        <div className='flex gap-2 pt-2'>
                          <Input
                            placeholder='Reply to this ticket...'
                            value={openId === t.id ? reply : ''}
                            onChange={e => setReply(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') sendReply(t.id) }}
                          />
                          <Button
                            className='bg-pink-500 hover:bg-pink-600'
                            disabled={replyingId === t.id || !reply.trim()}
                            onClick={() => sendReply(t.id)}
                          >
                            <FiSend />
                          </Button>
                        </div>
                      )}
                      {t.status === 'CLOSED' && (
                        <div className='text-xs text-gray-400 italic'>This ticket is closed.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className='bg-white shadow-sm border border-gray-100 rounded-lg p-5 flex flex-col gap-2'>
        <h1 className='font-bold text-xl'>Frequently Asked Questions</h1>
        <Accordion type='single' collapsible className='w-full flex flex-col gap-2'>
          <h2 className='font-bold text-pink-500'>Booking</h2>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>How do I book an appointment?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              Browse our artists, select a service, and choose an available time slot.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>Can I reschedule my booking?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              Yes, reschedule up to 24 hours before via the <strong>My Bookings</strong> page.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>What is the cancellation policy?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              Free cancellation up to 24 hours before the appointment.
            </AccordionContent>
          </AccordionItem>

          <h2 className='font-bold text-pink-500 mt-2'>Payments</h2>
          <AccordionItem value='item-4'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              All major credit cards, debit cards, and digital wallets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-5'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>When will I be charged?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              After your appointment is completed.
            </AccordionContent>
          </AccordionItem>

          <h2 className='font-bold text-pink-500 mt-2'>Loyalty Program</h2>
          <AccordionItem value='item-7'>
            <AccordionTrigger className='bg-gray-100 p-2 hover:no-underline hover:bg-gray-200 rounded-md'>How do I earn loyalty points?</AccordionTrigger>
            <AccordionContent className='text-gray-500'>
              Earn 50 points for every completed booking.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
