import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { db } from '@/lib/db';

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const b = db().prepare('SELECT client_id, status FROM bookings WHERE id = ?')
    .get(Number(id)) as any;
  if (!b) return NextResponse.json({ msg: 'Not found' }, { status: 404 });
  if (b.client_id !== uid) {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }
  if (b.status === 'COMPLETED' || b.status === 'CANCELLED') {
    return NextResponse.json({ msg: `Already ${b.status.toLowerCase()}` }, { status: 400 });
  }
  db().prepare("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?").run(Number(id));
  return NextResponse.json({ msg: 'Booking cancelled', id: Number(id) });
}
