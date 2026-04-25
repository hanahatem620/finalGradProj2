import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';

// Submit a review for a completed booking owned by the current user.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const bookingId = Number(body.booking_id);
  const rating = Number(body.rating);
  const comment = (body.comment || '').toString().trim() || null;

  if (!bookingId || rating < 1 || rating > 5) {
    return NextResponse.json({ msg: 'Invalid booking or rating' }, { status: 400 });
  }

  const bk = db().prepare(
    'SELECT client_id, provider_id, status FROM bookings WHERE id = ?'
  ).get(bookingId) as any;
  if (!bk) return NextResponse.json({ msg: 'Booking not found' }, { status: 404 });
  if (bk.client_id !== uid) {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }
  if (bk.status !== 'COMPLETED') {
    return NextResponse.json(
      { msg: 'Only completed bookings can be reviewed' }, { status: 400 }
    );
  }

  const existing = db().prepare('SELECT id FROM reviews WHERE booking_id = ?')
    .get(bookingId) as any;
  if (existing) {
    return NextResponse.json({ msg: 'Already reviewed' }, { status: 409 });
  }

  db().prepare(
    `INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(bookingId, uid, bk.provider_id, rating, comment, new Date().toISOString());

  return NextResponse.json({ msg: 'Review submitted' }, { status: 201 });
}
