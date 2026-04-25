'use server'
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';
import { db } from '@/lib/db';

export async function adminDashboard() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== 'admin' && role !== 'ADMIN')) return null;

  const totalUsers    = (db().prepare('SELECT COUNT(*) AS n FROM users').get() as any).n;
  const totalClients  = (db().prepare("SELECT COUNT(*) AS n FROM users WHERE role='CLIENT'").get() as any).n;
  const totalProviders = (db().prepare("SELECT COUNT(*) AS n FROM users WHERE role IN ('ARTIST','HAIRDRESSER')").get() as any).n;
  const totalBookings = (db().prepare('SELECT COUNT(*) AS n FROM bookings').get() as any).n;
  const totalRevenue  = (db().prepare("SELECT COALESCE(SUM(total_price),0) AS n FROM bookings WHERE status='COMPLETED'").get() as any).n;

  return {
    total_users: totalUsers,
    total_clients: totalClients,
    total_providers: totalProviders,
    total_bookings: totalBookings,
    total_revenue: totalRevenue,
  };
}