import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
import { db } from '@/lib/db'

const VALID = new Set(['CONFIRMED', 'CANCELLED', 'COMPLETED'])

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ 1) check login
  const session = await getServerSession(authOptions)
  const userId = Number((session?.user as any)?.id)
  const role = ((session?.user as any)?.role || '').toLowerCase()

  if (!userId || role !== 'artist' && 'hairdresser') {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 })
  }

  // ✅ 2) get id
  const { id } = await params

  const bookingId = Number(id)

  if (isNaN(bookingId)) {
    return NextResponse.json({ msg: 'Bad id' }, { status: 400 })
  }

  // ✅ 3) get status
  const body = await req.json().catch(() => ({} as any))
  const status = (body.status || '').toString().toUpperCase()
  const method = (body.method || '').toString().toUpperCase()


  if (!VALID.has(status)) {
    return NextResponse.json(
      { msg: 'Only CONFIRMED or CANCELLED allowed' },
      { status: 400 }
    )
  }

  // ✅ 4) check booking belongs to artist
  const booking = db()
    .prepare('SELECT id, status, provider_id, total_price FROM bookings WHERE id = ?')
    .get(bookingId) as any

  if (!booking) {
    return NextResponse.json({ msg: 'Not found' }, { status: 404 })
  }

  if (booking.provider_id !== userId) {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }

  // ✅ 5) prevent re-updating
const canTransition: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
}

if (!canTransition[booking.status]?.includes(status)) {
  return NextResponse.json(
    {
      msg: `Cannot change ${booking.status} → ${status}`,
    },
    { status: 400 }
  )
}

  // ✅ 6) update status
  db()
    .prepare('UPDATE bookings SET status = ? WHERE id = ?')
    .run(status, bookingId)

    if (status === 'COMPLETED') {
  const created_at = new Date().toISOString()

  db().prepare(`
    INSERT INTO transactions (
      booking_id,
      method,
      amount,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    bookingId,
    method,
    booking.total_price,
    'COMPLETED',
    created_at
  )
}

  return NextResponse.json({
    id: bookingId,
    status,
  })


  
}