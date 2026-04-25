import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';

// List current user's support tickets (creator_id) with their messages.
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const tickets = db().prepare(
    'SELECT * FROM support_tickets WHERE creator_id = ? ORDER BY created_at DESC'
  ).all(uid) as any[];

  const withMsgs = tickets.map(t => {
    const messages = db().prepare(
      'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC'
    ).all(t.id);
    return { ...t, messages };
  });
  return NextResponse.json(withMsgs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const title = (body.title || '').toString().trim() || null;
  const category = (body.category || '').toString().trim();
  const description = (body.description || '').toString().trim();
  const bookingId = body.booking_id ? Number(body.booking_id) : null;

  if (!category || !description) {
    return NextResponse.json({ msg: 'Category and description required' }, { status: 400 });
  }

  const info = db().prepare(
    `INSERT INTO support_tickets (creator_id, booking_id, title, category, description,
                                   status, created_at)
     VALUES (?, ?, ?, ?, ?, 'OPEN', ?)`
  ).run(uid, bookingId, title, category, description, new Date().toISOString());

  return NextResponse.json({ id: Number(info.lastInsertRowid), status: 'OPEN' }, { status: 201 });
}
