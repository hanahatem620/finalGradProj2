import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

// POST /api/payments  — create a new transaction

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  // Only admin / artist / hairdresser can record a payment
  // (clients pay through the booking flow, not directly)
  const allowed = ['admin', 'Manager', 'Artist', 'Hairdresser'];
  if (!allowed.includes(role)) {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({} as any));
    const { booking_id, method, amount } = body;

    if (!booking_id || !method || amount == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const booking = db()
      .prepare('SELECT id FROM bookings WHERE id = ?')
      .get(Number(booking_id));

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const created_at = new Date().toISOString();

    const info = db().prepare(`
      INSERT INTO transactions (booking_id, method, amount, status, created_at)
      VALUES (?, ?, ?, 'COMPLETED', ?)
    `).run(Number(booking_id), method, Number(amount), created_at);

    return NextResponse.json(
      {
        id: Number(info.lastInsertRowid),
        booking_id: Number(booking_id),
        method,
        amount: Number(amount),
        status: 'COMPLETED',
        created_at,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error('POST /api/payments error:', err);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}


// GET /api/payments  — fetch payments based on role
//
//  CLIENT        → transactions where bookings.client_id   = me
//  ARTIST /
//  HAIRDRESSER   → transactions where bookings.provider_id = me
//  ADMIN /
//  MANAGER       → ALL transactions + summary stats
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const uid = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── ADMIN / MANAGER — all transactions + full summary stats ──────────
    if (role === 'admin' || role === 'manager') {

      const payments = db().prepare(`
        SELECT
          t.*,
          b.client_id,
          b.provider_id,
          b.status        AS booking_status,
          cp.name         AS client_name,
          cu.email        AS client_email,
          pp.name         AS provider_name,
          pu.email        AS provider_email
        FROM transactions t
        LEFT JOIN bookings  b  ON b.id = t.booking_id
        LEFT JOIN users     cu ON cu.id = b.client_id
        LEFT JOIN profiles  cp ON cp.user_id = b.client_id
        LEFT JOIN users     pu ON pu.id = b.provider_id
        LEFT JOIN profiles  pp ON pp.user_id = b.provider_id
        ORDER BY t.created_at DESC
      `).all() as any[];

      // ── Summary numbers ──────────────────────────────────────────────
      const totalTransactions = payments.length;

      const totalRevenue = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const completedPayments = payments
        .filter(p => p.status === 'COMPLETED').length;

      const pendingAmounts = payments
        .filter(p => p.status !== 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      return NextResponse.json({
        payments,
        summary: {
          totalTransactions,
          totalRevenue:       Math.round(totalRevenue * 100) / 100,
          completedPayments,
          pendingAmounts:     Math.round(pendingAmounts * 100) / 100,
        }
      });
    }

    // ── CLIENT — transactions for bookings they made ─────────────────────
    if (role === 'client') {

      const payments = db().prepare(`
        SELECT
          t.*,
          b.start_datetime,
          b.end_datetime,
          b.status  AS booking_status,
          pp.name   AS provider_name,
          pu.email  AS provider_email
        FROM transactions t
        LEFT JOIN bookings  b  ON b.id = t.booking_id
        LEFT JOIN users     pu ON pu.id = b.provider_id
        LEFT JOIN profiles  pp ON pp.user_id = b.provider_id
        WHERE b.client_id = ?
        ORDER BY t.created_at DESC
      `).all(uid) as any[];

      const totalSpent = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const loyaltyPoints = payments
        .filter(p => p.status === 'COMPLETED').length * 50;

      return NextResponse.json({
        payments,
        summary: {
          totalSpent:    Math.round(totalSpent * 100) / 100,
          loyaltyPoints,
          totalPayments: payments.length,
        }
      });
    }

    // ── ARTIST / HAIRDRESSER — transactions for bookings made with them ───
    if (role === 'artist' || role === 'hairdresser') {

      const payments = db().prepare(`
        SELECT
          t.*,
          b.start_datetime,
          b.end_datetime,
          b.status  AS booking_status,
          cp.name   AS client_name,
          cu.email  AS client_email
        FROM transactions t
        LEFT JOIN bookings  b  ON b.id = t.booking_id
        LEFT JOIN users     cu ON cu.id = b.client_id
        LEFT JOIN profiles  cp ON cp.user_id = b.client_id
        WHERE b.provider_id = ?
        ORDER BY t.created_at DESC
      `).all(uid) as any[];

      const totalEarned = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const completedPayments = payments
        .filter(p => p.status === 'COMPLETED').length;

      return NextResponse.json({
        payments,
        summary: {
          totalEarned:       Math.round(totalEarned * 100) / 100,
          completedPayments,
          totalTransactions: payments.length,
        }
      });
    }

    // ── Unknown role ──────────────────────────────────────────────────────
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  } catch (err) {
    console.error('GET /api/payments error:', err);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}