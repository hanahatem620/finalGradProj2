import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json(
      { msg: 'Forbidden' },
      { status: 403 }
    );
  }

  const { id } = await ctx.params;

  const body = await req.json();

  const status = body.status;

  if (!['OPEN', 'IN_PROGRESS', 'CLOSED'].includes(status)) {
    return NextResponse.json(
      { msg: 'Invalid status' },
      { status: 400 }
    );
  }

  db().prepare(`
    UPDATE support_tickets
    SET status = ?
    WHERE id = ?
  `).run(status, Number(id));

  return NextResponse.json({
    msg: 'Status updated',
  });
}