import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';

// ───────────────────────── ensure table ─────────────────────────
function ensureTable() {
  db().prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      action_url TEXT,
      created_at TEXT NOT NULL
    )
  `).run();
}

// ───────────────────────── GET ─────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);

  const uid = Number((session?.user as any)?.id);
  if (!session) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }

  ensureTable();

  const rows = db().prepare(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).all(uid) as any[];

  const unread_count = rows.filter(n => !n.is_read).length;

  return NextResponse.json({
    unread_count,
    notifications: rows,
  });
}

// ───────────────────────── MARK READ ─────────────────────────
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);

  if (!uid) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }

  ensureTable();

  const body = await req.json().catch(() => ({} as any));

  // mark all
  if (body.all) {
    db().prepare(`
      UPDATE notifications SET is_read = 1 WHERE user_id = ?
    `).run(uid);

    return NextResponse.json({ msg: 'All marked as read' });
  }

  // mark one
  const id = Number(body.id);
  if (!id) {
    return NextResponse.json({ msg: 'Missing id' }, { status: 400 });
  }

  db().prepare(`
    UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
  `).run(id, uid);

  return NextResponse.json({ msg: 'Marked as read' });
}

// ───────────────────────── DELETE ─────────────────────────
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);

  if (!uid) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }

  ensureTable();

  const body = await req.json().catch(() => ({} as any));
  const id = Number(body.id);

  if (!id) {
    return NextResponse.json({ msg: 'Missing id' }, { status: 400 });
  }

  db().prepare(`
    DELETE FROM notifications
    WHERE id = ? AND user_id = ?
  `).run(id, uid);

  return NextResponse.json({ msg: 'Deleted' });
}