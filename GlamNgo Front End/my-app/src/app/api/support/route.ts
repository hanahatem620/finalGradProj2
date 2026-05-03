import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';

// List current user's support tickets (creator_id) with their messages.
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role)
  //  const isAdmin = role === 'admin' || role === 'manager'
  if (!session) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  // for admin
if (role === 'admin' || role === 'manager') {

  const tickets = db().prepare(`
    SELECT 
      st.id,
      st.creator_id,
      st.booking_id,
      st.category,
      st.status,
      st.created_at,
      st.admin_response,
      st.title,
      st.resolved_at,
      p.name AS creator_name,
      u.email AS creator_email
    FROM support_tickets st
    LEFT JOIN users u ON u.id = st.creator_id
    LEFT JOIN profiles p ON p.user_id = st.creator_id
    ORDER BY st.created_at DESC
  `).all() as any[];

  const withMessages = tickets.map(ticket => {
    const messages = db().prepare(`
      SELECT 
        id,
        ticket_id,
        sender_type,
        sender_name,
        body,
        created_at
      FROM ticket_messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).all(ticket.id);

    return {
      ...ticket,
      messages
    };
  });

  return NextResponse.json(withMessages);
}

  // for client
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
