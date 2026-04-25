import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db } from '@/lib/db';

// Returns the current user's bookings with joined provider info + whether
// a review was already submitted, so the frontend can skip an extra round-trip.
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid && uid !== 0) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }
  const rows = db().prepare(`
    SELECT b.*,
           pu.email       AS provider_email,
           pu.role        AS provider_role,
           pp.name        AS provider_name,
           pp.image_url   AS provider_image,
           EXISTS(SELECT 1 FROM reviews r WHERE r.booking_id = b.id) AS reviewed
    FROM bookings b
    LEFT JOIN users u       ON u.id = b.provider_id
    LEFT JOIN users pu      ON pu.id = b.provider_id
    LEFT JOIN profiles pp   ON pp.user_id = b.provider_id
    WHERE b.client_id = ?
    ORDER BY b.start_datetime DESC
  `).all(uid) as any[];

  return NextResponse.json(rows.map(b => ({
    id: b.id,
    client_id: b.client_id,
    provider_id: b.provider_id,
    provider_name: b.provider_name || (b.provider_email || '').split('@')[0],
    provider_role: (b.provider_role || '').toLowerCase(),
    provider_image: b.provider_image || null,
    start_datetime: b.start_datetime,
    end_datetime: b.end_datetime,
    status: b.status,
    total_price: b.total_price,
    created_at: b.created_at,
    reviewed: !!b.reviewed,
  })));
}
