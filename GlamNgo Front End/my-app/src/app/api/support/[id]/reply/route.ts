import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { db } from '@/lib/db';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();
  if (!uid && uid !== 0) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({} as any));
  const text = (body.body || '').toString().trim();
  if (!text) return NextResponse.json({ msg: 'Empty message' }, { status: 400 });

  const t = db().prepare('SELECT creator_id FROM support_tickets WHERE id = ?')
    .get(Number(id)) as any;
  if (!t) return NextResponse.json({ msg: 'Not found' }, { status: 404 });

  const isAdmin = role === 'admin' || role === 'manager';
  if (!isAdmin && t.creator_id !== uid) {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });
  }

  db().prepare(
    `INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, body, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    Number(id),
    isAdmin ? 'ADMIN' : 'CLIENT',
    isAdmin ? 'Support' : (session?.user as any)?.name || 'Client',
    text,
    new Date().toISOString(),
  );
  return NextResponse.json({ msg: 'Reply added' }, { status: 201 });
}
