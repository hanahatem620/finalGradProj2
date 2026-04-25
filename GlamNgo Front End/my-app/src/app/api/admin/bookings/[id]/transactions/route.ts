import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
import { db } from '@/lib/db'

const VALID_METHOD = new Set(['CASH', 'CARD'])

// Record a payment for a booking. Called by the admin detail page when
// moving a booking into COMPLETED via the Cash / Card picker.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = ((session?.user as any)?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }
  const { id } = await ctx.params
  const bookingId = Number(id)
  const body = await req.json().catch(() => ({} as any))
  const method = (body.method || '').toString().toUpperCase()
  if (!VALID_METHOD.has(method)) {
    return NextResponse.json({ msg: 'Method must be CASH or CARD' }, { status: 400 })
  }
  const bk = db().prepare('SELECT total_price FROM bookings WHERE id = ?')
    .get(bookingId) as any
  if (!bk) return NextResponse.json({ msg: 'Booking not found' }, { status: 404 })

  // A booking has at most ONE active payment record. If one already exists
  // (e.g. admin moved Completed → Confirmed → Completed and the cleanup in
  // the status route didn't run for some reason), wipe it before inserting
  // the new method so totals can't double up.
  db().prepare('DELETE FROM transactions WHERE booking_id = ?').run(bookingId)

  const info = db().prepare(
    `INSERT INTO transactions (booking_id, method, amount, status, created_at)
     VALUES (?, ?, ?, 'COMPLETED', ?)`
  ).run(bookingId, method, bk.total_price || 0, new Date().toISOString())
  return NextResponse.json({ id: Number(info.lastInsertRowid), method }, { status: 201 })
}
