'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  LuArrowLeft, LuReceipt, LuTrash2, LuTag, LuDollarSign, LuCreditCard,
} from 'react-icons/lu'

interface Txn {
  id: number
  method: string
  amount: number
  status: string
  created_at: string
}
interface Item {
  id: number
  item_type: string | null
  item_name: string | null
  price_at_booking: number
  addons_summary: string | null
}
interface Booking {
  id: number
  client_id: number
  client_email: string
  client_name: string | null
  provider_id: number
  provider_email: string
  provider_name: string | null
  provider_image?: string | null
  start_datetime: string
  end_datetime: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  total_price: number
  created_at: string
  items: Item[]
  transactions: Txn[]
}

const statusTone: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const

function fmtFull(s: string) {
  try {
    return new Date(s).toLocaleString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return s }
}
function fmtDate(s: string) {
  try { return new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return s }
}
function duration(s: string, e: string) {
  try { return Math.round((new Date(e).getTime() - new Date(s).getTime()) / 60000) }
  catch { return 0 }
}

export default function AdminBookingDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)

  const [b, setB] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingStatus, setPendingStatus] = useState<string>('')
  const [saving, setSaving] = useState(false)

  // Discount modal
  const [discountOpen, setDiscountOpen] = useState(false)
  const [discountPct, setDiscountPct] = useState<number>(10)

  // Payment-method modal (shown when admin picks COMPLETED)
  const [paymentOpen, setPaymentOpen] = useState(false)

  async function load() {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`)
      if (!res.ok) { setB(null); return }
      const data = await res.json()
      setB(data)
      setPendingStatus(data.status)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [id])

  const itemsSum = useMemo(() =>
    (b?.items || []).reduce((s, it) => s + (it.price_at_booking || 0), 0)
  , [b])
  const currentBase = itemsSum > 0 ? itemsSum : (b?.total_price || 0)
  const currentPct = useMemo(() => {
    if (!b || currentBase <= 0 || b.total_price >= currentBase) return 0
    return Math.round((1 - b.total_price / currentBase) * 100)
  }, [b, currentBase])
  const discountPreviewTotal = Math.round(currentBase * (1 - discountPct / 100) * 100) / 100

  async function applyStatus(status: string, opts: { paymentMethod?: string } = {}) {
    if (!b) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${b.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        toast.error('Failed to update status', { position: 'top-center' })
        return
      }
      // If moving to COMPLETED with a payment method, record the txn.
      if (status === 'COMPLETED' && opts.paymentMethod) {
        await fetch(`/api/admin/bookings/${b.id}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: opts.paymentMethod }),
        })
      }
      toast.success(`Status → ${status.toLowerCase()}`, { position: 'top-center' })
      await load()
    } finally {
      setSaving(false)
    }
  }

  function onUpdateClick() {
    if (!b || pendingStatus === b.status) return
    if (pendingStatus === 'COMPLETED') {
      // Ask for payment method before completing
      setPaymentOpen(true)
    } else {
      applyStatus(pendingStatus)
    }
  }

  async function applyDiscount() {
    if (!b) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${b.id}/discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discount_pct: discountPct }),
      })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        toast.error(data.msg || 'Failed to apply', { position: 'top-center' })
        return
      }
      toast.success(
        discountPct === 0
          ? `Discount removed. Total restored: EGP ${data.total_price.toFixed(2)}`
          : `${discountPct}% discount applied. New total: EGP ${data.total_price.toFixed(2)}`,
        { position: 'top-center' },
      )
      setDiscountOpen(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function del() {
    if (!b) return
    if (!confirm(`Permanently delete booking #${b.id}? This cannot be undone.`)) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${b.id}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Delete failed', { position: 'top-center' })
        return
      }
      toast.success('Booking deleted', { position: 'top-center' })
      router.push('/admin/bookings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='px-4 lg:px-8 py-8'>
        <div className='animate-pulse space-y-3'>
          <div className='h-10 w-48 bg-gray-200 rounded' />
          <div className='h-60 bg-white rounded-xl border border-gray-100' />
        </div>
      </div>
    )
  }
  if (!b) {
    return (
      <div className='px-4 lg:px-8 py-16 text-center'>
        <h1 className='text-2xl font-bold text-gray-700'>Booking not found</h1>
        <Link href='/admin/bookings' className='inline-block mt-4'>
          <Button variant='outline'><LuArrowLeft className='me-1' /> Back to bookings</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='px-4 lg:px-8 py-8 space-y-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex flex-wrap items-center justify-between gap-3'
      >
        <div>
          <Link href='/admin/bookings' className='text-xs text-gray-500 hover:text-pink-500 inline-flex items-center gap-1'>
            <LuArrowLeft /> Bookings
          </Link>
          <div className='flex items-center gap-2 mt-1'>
            <h1 className='text-3xl font-bold tracking-tight'>Booking #{b.id}</h1>
            <Badge className={statusTone[b.status]}>{b.status}</Badge>
          </div>
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Status updater — always visible so admins can reverse a wrong
              cancellation or revert a too-early completion. */}
          <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1'>
            <select
              value={pendingStatus}
              onChange={e => setPendingStatus(e.target.value)}
              className='text-sm bg-transparent outline-none px-2 py-1'
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button
              size='sm'
              disabled={saving || pendingStatus === b.status}
              onClick={onUpdateClick}
              className='bg-pink-500 hover:bg-pink-600'
            >
              Update
            </Button>
          </div>
          <Link href={`/admin/bookings/${b.id}/receipt`} target='_blank'>
            <Button variant='outline' size='sm'>
              <LuReceipt className='me-1' /> Receipt
            </Button>
          </Link>
          <Button
            variant='outline'
            size='sm'
            className='border-red-200 text-red-600 hover:bg-red-50'
            onClick={del}
            disabled={saving}
          >
            <LuTrash2 className='me-1' /> Delete
          </Button>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='bg-white rounded-xl border border-gray-100 shadow-sm'
        >
          <div className='px-5 py-3 border-b border-gray-100 font-semibold'>Booking Details</div>
          <table className='w-full text-sm'>
            <tbody>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3 w-[30%]'>Client</th>
                <td className='px-5 py-3'>
                  <div>{b.client_name || b.client_email?.split('@')[0]}</div>
                  <div className='text-xs text-gray-400'>{b.client_email}</div>
                </td>
              </tr>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>Provider</th>
                <td className='px-5 py-3'>
                  <div>{b.provider_name || b.provider_email?.split('@')[0]}</div>
                  <div className='text-xs text-gray-400'>{b.provider_email}</div>
                </td>
              </tr>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>Start</th>
                <td className='px-5 py-3'>{fmtFull(b.start_datetime)}</td>
              </tr>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>End</th>
                <td className='px-5 py-3'>{fmtFull(b.end_datetime)}</td>
              </tr>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>Duration</th>
                <td className='px-5 py-3'>{duration(b.start_datetime, b.end_datetime)} min</td>
              </tr>
              <tr className='border-b border-gray-50'>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>Price</th>
                <td className='px-5 py-3'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <strong>EGP {b.total_price.toFixed(2)}</strong>
                    {currentPct > 0 && (
                      <>
                        <Badge className='bg-yellow-100 text-yellow-700'>{currentPct}% off</Badge>
                        <span className='text-xs text-gray-400'>
                          (from EGP {currentBase.toFixed(2)})
                        </span>
                      </>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-yellow-300 text-yellow-700 hover:bg-yellow-50 ms-auto'
                      onClick={() => { setDiscountPct(currentPct || 10); setDiscountOpen(true) }}
                    >
                      <LuTag className='me-1' /> Discount
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <th className='text-left font-semibold text-gray-600 px-5 py-3'>Created</th>
                <td className='px-5 py-3'>{fmtDate(b.created_at)}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Services/Items + Payment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className='flex flex-col gap-5'
        >
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='px-5 py-3 border-b border-gray-100 font-semibold'>Services / Items</div>
            {b.items.length === 0 ? (
              <div className='p-5 text-sm text-gray-500 italic'>No items recorded.</div>
            ) : (
              <table className='w-full text-sm'>
                <thead className='text-xs uppercase text-gray-500 bg-gray-50'>
                  <tr>
                    <th className='px-5 py-2 text-left'>Item</th>
                    <th className='px-5 py-2 text-left'>Type</th>
                    <th className='px-5 py-2 text-right'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {b.items.map(it => (
                    <tr key={it.id} className='border-t border-gray-50'>
                      <td className='px-5 py-3'>
                        {it.item_name || '—'}
                        {it.addons_summary && (
                          <div className='text-xs text-gray-400 mt-0.5'>+ {it.addons_summary}</div>
                        )}
                      </td>
                      <td className='px-5 py-3'>
                        {it.item_type && <Badge className='bg-gray-100 text-gray-700'>{it.item_type}</Badge>}
                      </td>
                      <td className='px-5 py-3 text-right font-semibold'>EGP {it.price_at_booking.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='px-5 py-3 border-b border-gray-100 font-semibold'>Payment</div>
            {b.transactions.length === 0 ? (
              <div className='p-5 text-sm text-gray-500 italic'>No payment recorded.</div>
            ) : (
              <table className='w-full text-sm'>
                <thead className='text-xs uppercase text-gray-500 bg-gray-50'>
                  <tr>
                    <th className='px-5 py-2 text-left'>Method</th>
                    <th className='px-5 py-2 text-left'>Amount</th>
                    <th className='px-5 py-2 text-left'>Status</th>
                    <th className='px-5 py-2 text-right'>When</th>
                  </tr>
                </thead>
                <tbody>
                  {b.transactions.map(t => (
                    <tr key={t.id} className='border-t border-gray-50'>
                      <td className='px-5 py-3 font-semibold'>{t.method}</td>
                      <td className='px-5 py-3'>EGP {t.amount.toFixed(2)}</td>
                      <td className='px-5 py-3'>
                        <Badge className={t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className='px-5 py-3 text-right text-xs text-gray-500'>{fmtDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Discount modal */}
      <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <LuTag /> Apply Discount
            </DialogTitle>
            <DialogDescription className='sr-only'>Apply a discount to this booking.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div>
              <label className='text-sm font-semibold'>
                Discount % <span className='text-gray-400 font-normal'>(0–20)</span>
              </label>
              <Input
                type='number'
                min={0}
                max={20}
                step={1}
                value={discountPct}
                onChange={e => {
                  const n = Math.min(20, Math.max(0, parseInt(e.target.value) || 0))
                  setDiscountPct(n)
                }}
              />
              <div className='mt-2 text-sm text-gray-500'>
                EGP {currentBase.toFixed(2)} → <strong className='text-pink-600'>EGP {discountPreviewTotal.toFixed(2)}</strong>
                {' '}
                <span className='text-gray-400'>{discountPct > 0 ? `(${discountPct}% off)` : '(no discount)'}</span>
              </div>
            </div>
            <div className='flex gap-2 justify-end pt-2'>
              <Button variant='outline' size='sm' onClick={() => setDiscountOpen(false)}>Cancel</Button>
              <Button
                size='sm'
                className='bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                disabled={saving}
                onClick={applyDiscount}
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment method modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <LuCreditCard /> Payment Method
            </DialogTitle>
            <DialogDescription>How was this booking paid?</DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-1 gap-2'>
            <Button
              variant='outline'
              size='lg'
              className='border-green-300 text-green-700 hover:bg-green-50'
              onClick={() => { setPaymentOpen(false); applyStatus('COMPLETED', { paymentMethod: 'CASH' }) }}
            >
              <LuDollarSign className='me-2' /> Cash
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border-blue-300 text-blue-700 hover:bg-blue-50'
              onClick={() => { setPaymentOpen(false); applyStatus('COMPLETED', { paymentMethod: 'CARD' }) }}
            >
              <LuCreditCard className='me-2' /> Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
