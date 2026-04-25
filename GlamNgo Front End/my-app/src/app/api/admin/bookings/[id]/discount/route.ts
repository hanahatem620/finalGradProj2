import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
import { db } from '@/lib/db'

// Apply a 0-20 % discount to a booking. Always recomputed from the ORIGINAL
// subtotal (sum of booking_items.price_at_booking), so repeated applies
// never stack and pct=0 restores the full price.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = ((session?.user as any)?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }
  const { id } = await ctx.params
  const bookingId = Number(id)
  const body = await req.json().catch(() => ({} as any))
  const pct = Number(body.discount_pct)
  if (!Number.isFinite(pct) || pct < 0 || pct > 20) {
    return NextResponse.json({ msg: 'Discount must be 0–20 %' }, { status: 400 })
  }

  const bk = db().prepare('SELECT id, total_price FROM bookings WHERE id = ?')
    .get(bookingId) as any
  if (!bk) return NextResponse.json({ msg: 'Not found' }, { status: 404 })

  // Find a stable subtotal to discount against. If the booking has no items
  // (older bookings created before booking_items was wired in), seed a
  // single synthesized item with the current total_price — locking it in
  // as the canonical base so subsequent applies can never stack.
  let itemsSum = (db().prepare(
    'SELECT COALESCE(SUM(price_at_booking),0) AS s FROM booking_items WHERE booking_id = ?'
  ).get(bookingId) as any).s as number

  if (itemsSum <= 0) {
    const seed = bk.total_price || 0
    db().prepare(
      `INSERT INTO booking_items (booking_id, item_type, item_name, price_at_booking)
       VALUES (?, 'SERVICE', 'Service', ?)`
    ).run(bookingId, seed)
    itemsSum = seed
  }

  const base = itemsSum
  const newTotal = Math.round(base * (1 - pct / 100) * 100) / 100

  db().prepare('UPDATE bookings SET total_price = ? WHERE id = ?')
    .run(newTotal, bookingId)

  return NextResponse.json({ id: bookingId, total_price: newTotal, base, pct })
}
