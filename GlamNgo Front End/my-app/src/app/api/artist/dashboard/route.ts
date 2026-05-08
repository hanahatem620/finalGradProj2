import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db } from '@/lib/db';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/artist/dashboard
// Returns overview stats for the logged-in artist:
//   - pending_bookings count
//   - accepted_bookings count
//   - completed_bookings count
//   - available_days (days in next 30 days that have working hours)
//   - average rating + review count
//   - total earnings (from COMPLETED bookings)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'artist' && role !== 'hairdresser') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }

  // ── Booking counts ──────────────────────────────────────────────────────
  const pendingCount = (db().prepare(`
    SELECT COUNT(*) AS n FROM bookings
    WHERE provider_id = ? AND status = 'PENDING'
  `).get(uid) as any).n;

  const acceptedCount = (db().prepare(`
    SELECT COUNT(*) AS n FROM bookings
    WHERE provider_id = ? AND status = 'CONFIRMED'
  `).get(uid) as any).n;

  const completedCount = (db().prepare(`
    SELECT COUNT(*) AS n FROM bookings
    WHERE provider_id = ? AND status = 'COMPLETED'
  `).get(uid) as any).n;

  const cancelledCount = (db().prepare(`
    SELECT COUNT(*) AS n FROM bookings
    WHERE provider_id = ? AND status = 'CANCELLED'
  `).get(uid) as any).n;

  // ── Available days in next 30 days ──────────────────────────────────────
  // A day is "available" if the artist has an availability_rule for that weekday
  const rules = db().prepare(`
    SELECT DISTINCT day_of_week FROM availability_rules WHERE provider_id = ?
  `).all(uid) as any[];

  const availableWeekdays = new Set(rules.map((r: any) => r.day_of_week));

  let availableDaysCount = 0;
  for (let i = 1; i <= 30; i++) {
    const d   = new Date();
    d.setDate(d.getDate() + i);
    // JS: Sun=0..Sat=6 → Python/DB: Mon=0..Sun=6
    const pyDow = (d.getDay() + 6) % 7;
    if (availableWeekdays.has(pyDow)) availableDaysCount++;
  }

const reviews = db().prepare(`
  SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    p.name AS client_name
  FROM reviews r
  JOIN users u ON u.id = r.client_id
  JOIN profiles p ON p.user_id = u.id
  WHERE r.provider_id = ?
  ORDER BY r.created_at DESC
`).all(uid) as any[]


  // ── Reviews ─────────────────────────────────────────────────────────────
  const reviewStats = db().prepare(`
    SELECT
      ROUND(AVG(rating), 1) AS average_stars,
      COUNT(*)              AS review_count
    FROM reviews
    WHERE provider_id = ?
  `).get(uid) as any;

  // ── Total earnings ───────────────────────────────────────────────────────
  const earnings = db().prepare(`
    SELECT COALESCE(SUM(b.total_price), 0) AS total
    FROM bookings b
    WHERE b.provider_id = ? AND b.status = 'COMPLETED'
  `).get(uid) as any;

  return NextResponse.json({
    bookings: {
      pending:   pendingCount,
      accepted:  acceptedCount,
      completed: completedCount,
      cancelled: cancelledCount,
    },
    available_days: availableDaysCount,
    reviews: {
      average_stars: reviewStats?.average_stars ?? 0,
      review_count:  reviewStats?.review_count  ?? 0,
      items: reviews,
    },
    total_earnings: Math.round((earnings?.total ?? 0) * 100) / 100,
  });
}