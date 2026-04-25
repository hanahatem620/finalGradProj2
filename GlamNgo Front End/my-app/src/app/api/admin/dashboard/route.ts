import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'admin' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }
  const totalUsers = (db().prepare('SELECT COUNT(*) AS n FROM users').get() as any).n;
  const totalClients = (db().prepare(
    "SELECT COUNT(*) AS n FROM users WHERE role = 'CLIENT'"
  ).get() as any).n;
  const totalProviders = (db().prepare(
    "SELECT COUNT(*) AS n FROM users WHERE role IN ('ARTIST','HAIRDRESSER')"
  ).get() as any).n;
  const totalBookings = (db().prepare(
    'SELECT COUNT(*) AS n FROM bookings'
  ).get() as any).n;
  const totalRevenue = (db().prepare(
    "SELECT COALESCE(SUM(total_price), 0) AS n FROM bookings WHERE status = 'COMPLETED'"
  ).get() as any).n;
  return NextResponse.json({
    total_users: totalUsers,
    total_clients: totalClients,
    total_providers: totalProviders,
    total_bookings: totalBookings,
    total_revenue: totalRevenue,
  });
}
