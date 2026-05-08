import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db } from '@/lib/db';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/artist/bookings?status=PENDING|CONFIRMED|COMPLETED|ALL
//
// Returns bookings for the logged-in artist with:
//   - client name + email
//   - services booked (from booking_items)
//   - date and time
//   - booking status
//   - available actions per status
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'artist' && role !== 'hairdresser') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }

  const url    = new URL(req.url);
  const status = (url.searchParams.get('status') || 'ALL').toUpperCase();

  const VALID = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // ── Build query ─────────────────────────────────────────────────────────
  let query = `
    SELECT
      b.id,
      b.client_id,
      b.start_datetime,
      b.end_datetime,
      b.status,
      b.total_price,
      b.created_at,
      cp.name   AS client_name,
      cu.email  AS client_email,
      cu.phone  AS client_phone,
      cp.image_url AS client_image
    FROM bookings b
    LEFT JOIN users    cu ON cu.id = b.client_id
    LEFT JOIN profiles cp ON cp.user_id = b.client_id
    WHERE b.provider_id = ?
  `;

  const params: any[] = [uid];

  if (status !== 'ALL') {
    query += ' AND b.status = ?';
    params.push(status);
  }

  query += ' ORDER BY b.start_datetime DESC';

  const rows = db().prepare(query).all(...params) as any[];

  // ── Attach services + actions to each booking ────────────────────────────
  const bookings = rows.map(b => {

    // Services from booking_items (if any)
    const services = db().prepare(`
      SELECT
        bi.item_name,
        bi.item_type,
        bi.price_at_booking
      FROM booking_items bi
      WHERE bi.booking_id = ?
    `).all(b.id) as any[];

    // Derive available actions based on status
    const actions: string[] = [];
    if (b.status === 'PENDING') {
      actions.push('ACCEPT');
      actions.push('REJECT');
    }
    if (b.status === 'CONFIRMED') {
      actions.push('COMPLETE');
      actions.push('CANCEL');
    }

    // Format date / time
    const startDate = new Date(b.start_datetime);
    const endDate   = new Date(b.end_datetime);

    return {
      id:           b.id,
      status:       b.status,
      total_price:  b.total_price,
      created_at:   b.created_at,
      date:         startDate.toLocaleDateString(undefined, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }),
      time: {
        start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end:   endDate.toLocaleTimeString([],   { hour: '2-digit', minute: '2-digit' }),
        duration_min: Math.round((endDate.getTime() - startDate.getTime()) / 60000),
      },
      client: {
        id:       b.client_id,
        name:     b.client_name  || b.client_email?.split('@')[0],
        email:    b.client_email || null,
        phone:    b.client_phone || null,
        image:    b.client_image || null,
      },
      services: services.map(s => ({
        name:  s.item_name  || 'Service',
        type:  s.item_type  || null,
        price: s.price_at_booking,
      })),
      actions,
    };
  });

  return NextResponse.json({
    total: bookings.length,
    bookings,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/artist/bookings
// Body: { booking_id: number, action: 'ACCEPT' | 'REJECT' | 'COMPLETE' | 'CANCEL' }
//
// ACCEPT  → PENDING   → CONFIRMED
// REJECT  → PENDING   → CANCELLED
// COMPLETE→ CONFIRMED → COMPLETED
// CANCEL  → CONFIRMED → CANCELLED
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'artist' && role !== 'hairdresser') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }

  const body       = await req.json().catch(() => ({} as any));
  const bookingId  = Number(body.booking_id);
  const action     = (body.action || '').toString().toUpperCase();

  if (!bookingId || !action) {
    return NextResponse.json({ error: 'booking_id and action are required' }, { status: 400 });
  }

  // Fetch booking — must belong to this artist
  const booking = db().prepare(`
    SELECT id, status, provider_id FROM bookings WHERE id = ?
  `).get(bookingId) as any;

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.provider_id !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ── Transition map ────────────────────────────────────────────────────────
  const transitions: Record<string, { from: string; to: string }> = {
    ACCEPT:   { from: 'PENDING',    to: 'CONFIRMED'  },
    REJECT:   { from: 'PENDING',    to: 'CANCELLED'  },
    COMPLETE: { from: 'CONFIRMED',  to: 'COMPLETED'  },
    CANCEL:   { from: 'CONFIRMED',  to: 'CANCELLED'  },
  };

  const transition = transitions[action];
  if (!transition) {
    return NextResponse.json(
      { error: 'Action must be ACCEPT, REJECT, COMPLETE, or CANCEL' },
      { status: 400 }
    );
  }

  if (booking.status !== transition.from) {
    return NextResponse.json(
      { error: `Cannot ${action} a booking with status ${booking.status}` },
      { status: 400 }
    );
  }

  // Apply transition
  db().prepare(
    'UPDATE bookings SET status = ? WHERE id = ?'
  ).run(transition.to, bookingId);

  return NextResponse.json({
    id:     bookingId,
    action,
    status: transition.to,
    msg:    `Booking ${action.toLowerCase()}ed successfully`,
  });
}