import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
import { db } from '@/lib/db'

const VALID = new Set(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const role = ((session?.user as any)?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }

  const { id } = await ctx.params
  const bookingId = Number(id)
  if (!bookingId) return NextResponse.json({ msg: 'Bad id' }, { status: 400 })

  const body = await req.json().catch(() => ({} as any))
  const status = (body.status || '').toString().toUpperCase()
  if (!VALID.has(status)) {
    return NextResponse.json(
      { msg: `Status must be one of ${[...VALID].join(', ')}` },
      { status: 400 },
    )
  }

  const existing = db().prepare('SELECT id, status FROM bookings WHERE id = ?')
    .get(bookingId) as any
  if (!existing) return NextResponse.json({ msg: 'Not found' }, { status: 404 })

  db().prepare('UPDATE bookings SET status = ? WHERE id = ?')
    .run(status, bookingId)

  // If we're moving the booking AWAY from COMPLETED (back to PENDING /
  // CONFIRMED / CANCELLED), wipe any prior payment records — they no
  // longer apply to a non-completed booking, and leaving them around
  // would let stale "charges" stack if the admin re-completes later
  // with a different method.
  if (existing.status === 'COMPLETED' && status !== 'COMPLETED') {
    db().prepare('DELETE FROM transactions WHERE booking_id = ?').run(bookingId)
  }

  return NextResponse.json({ id: bookingId, status })
}
