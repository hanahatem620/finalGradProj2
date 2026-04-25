import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../auth'
import { db } from '@/lib/db'

// Full booking detail for admins: joined with client+provider, plus the
// booking_items and transactions tables the Flask side wrote to.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = ((session?.user as any)?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }
  const { id } = await ctx.params
  const bookingId = Number(id)
  const row = db().prepare(`
    SELECT b.*,
           cu.email AS client_email,
           cp.name  AS client_name,
           pu.email AS provider_email,
           pp.name  AS provider_name,
           pp.image_url AS provider_image
    FROM bookings b
    LEFT JOIN users cu    ON cu.id = b.client_id
    LEFT JOIN profiles cp ON cp.user_id = b.client_id
    LEFT JOIN users pu    ON pu.id = b.provider_id
    LEFT JOIN profiles pp ON pp.user_id = b.provider_id
    WHERE b.id = ?
  `).get(bookingId) as any
  if (!row) return NextResponse.json({ msg: 'Not found' }, { status: 404 })

  const items = db().prepare(
    'SELECT * FROM booking_items WHERE booking_id = ?'
  ).all(bookingId)
  const transactions = db().prepare(
    'SELECT * FROM transactions WHERE booking_id = ? ORDER BY created_at DESC'
  ).all(bookingId)

  return NextResponse.json({ ...row, items, transactions })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = ((session?.user as any)?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }
  const { id } = await ctx.params
  const bookingId = Number(id)
  // Clean up dependents first (the Flask cascade-delete relationship isn't
  // honoured by raw better-sqlite3 queries).
  db().prepare('DELETE FROM booking_items WHERE booking_id = ?').run(bookingId)
  db().prepare('DELETE FROM transactions  WHERE booking_id = ?').run(bookingId)
  db().prepare('DELETE FROM reviews        WHERE booking_id = ?').run(bookingId)
  const info = db().prepare('DELETE FROM bookings WHERE id = ?').run(bookingId)
  if (info.changes === 0) return NextResponse.json({ msg: 'Not found' }, { status: 404 })
  return NextResponse.json({ msg: 'Deleted' })
}
