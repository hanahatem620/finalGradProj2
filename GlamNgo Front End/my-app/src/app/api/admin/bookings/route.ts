import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = ((session?.user as any)?.role || '').toLowerCase();
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }
  const rows = db().prepare(`
    SELECT b.*,
           cp.name AS client_name,
           cu.email AS client_email,
           pp.name AS provider_name,
           pu.email AS provider_email
    FROM bookings b
    LEFT JOIN users cu ON cu.id = b.client_id
    LEFT JOIN profiles cp ON cp.user_id = b.client_id
    LEFT JOIN users pu ON pu.id = b.provider_id
    LEFT JOIN profiles pp ON pp.user_id = b.provider_id
    ORDER BY b.start_datetime DESC
    LIMIT 200
  `).all();
  return NextResponse.json(rows);
}
