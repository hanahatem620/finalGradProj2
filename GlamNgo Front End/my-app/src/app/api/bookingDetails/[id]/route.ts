import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '../../../../../auth';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/client/bookings/[id]
// Returns full booking details for the logged-in client
//
// Response includes:
//   - booking status, date, time (from → to), duration
//   - artist name, role, image, location, bio
//   - artist rating (average stars) + review count
//   - services booked: name, type, description, duration, price
//   - total price
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(
  _req: Request,
    context: { params: Promise<{ id: string }> }

) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'client') return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });

  const { id } = await context.params;

  const bookingId = Number(id);

  if (!bookingId) {
    return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
  }

  // ── Fetch booking ────────────────────────────────────────────────────────
  const booking = db().prepare(`
    SELECT
      b.id,
      b.client_id,
      b.provider_id,
      b.start_datetime,
      b.end_datetime,
      b.status,
      b.total_price,
      b.created_at,

      -- Artist info
      pu.role        AS artist_role,
      pu.email       AS artist_email,
      pp.name        AS artist_name,
      pp.image_url   AS artist_image,
      pp.location    AS artist_location,
      pp.bio         AS artist_bio,
      pp.contact_info AS artist_contact

    FROM bookings b
    LEFT JOIN users    pu ON pu.id = b.provider_id
    LEFT JOIN profiles pp ON pp.user_id = b.provider_id
    WHERE b.id = ? AND b.client_id = ?
  `).get(bookingId, uid) as any;

  // Not found or doesn't belong to this client
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // ── Services ─────────────────────────────────────────────────────────────
  // Try booking_items first (new bookings) then fall back to services table
  const bookingItems = db().prepare(`
    SELECT
      bi.item_name        AS name,
      bi.item_type        AS type,
      bi.price_at_booking AS price,
      s.description,
      s.duration
    FROM booking_items bi
    LEFT JOIN services s ON s.id = bi.service_id
    WHERE bi.booking_id = ?
  `).all(bookingId) as any[];

  // ── Artist review stats ──────────────────────────────────────────────────
  const reviewStats = db().prepare(`
    SELECT
      ROUND(AVG(rating), 1) AS average_stars,
      COUNT(*)              AS review_count
    FROM reviews
    WHERE provider_id = ?
  `).get(booking.provider_id) as any;

  // ── Check if this booking was already reviewed ───────────────────────────
  const reviewed = !!db().prepare(
    'SELECT id FROM reviews WHERE booking_id = ? AND client_id = ?'
  ).get(bookingId, uid);

  // ── Format date / time / duration ───────────────────────────────────────
  const startDate    = new Date(booking.start_datetime);
  const endDate      = new Date(booking.end_datetime);
  const durationMin  = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  const dateFormatted = startDate.toLocaleDateString(undefined, {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  const timeFrom = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeTo   = endDate.toLocaleTimeString([],   { hour: '2-digit', minute: '2-digit' });

  // ── Build response ────────────────────────────────────────────────────────
  return NextResponse.json({
    id:         booking.id,
    status:     booking.status,
    created_at: booking.created_at,
    reviewed,

    // Date & time
    date:     dateFormatted,
    time: {
      from:         timeFrom,
      to:           timeTo,
      duration_min: durationMin,
    },

    // Artist
    artist: {
      id:       booking.provider_id,
      name:     booking.artist_name    || booking.artist_email?.split('@')[0],
      role:     booking.artist_role    || null,
      email:    booking.artist_email   || null,
      image:    booking.artist_image   || null,
      location: booking.artist_location || null,
      bio:      booking.artist_bio     || null,
      contact:  booking.artist_contact || null,
      reviews: {
        average_stars: reviewStats?.average_stars ?? 0,
        review_count:  reviewStats?.review_count  ?? 0,
      },
    },

    // Services
    services: bookingItems.map(s => ({
      name:        s.name        || 'Service',
      type:        s.type        || null,
      description: s.description || null,
      duration:    s.duration    || null,
      price:       s.price,
    })),

    // Price
    total_price: booking.total_price,
  });
}