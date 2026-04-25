import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashWerkzeugScrypt } from '@/lib/password';

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({} as any));
  const token = (data.reset_token || '').toString();
  const password = (data.password || '').toString();
  if (!token || !password) {
    return NextResponse.json({ msg: 'Missing token or password' }, { status: 400 });
  }
  const row = db().prepare(
    'SELECT id, reset_token_expiration FROM users WHERE reset_token = ?'
  ).get(token) as any;
  if (!row) return NextResponse.json({ msg: 'Invalid token' }, { status: 400 });
  const exp = row.reset_token_expiration ? new Date(row.reset_token_expiration) : null;
  if (!exp || exp.getTime() < Date.now()) {
    return NextResponse.json({ msg: 'Token expired' }, { status: 400 });
  }
  db().prepare(
    `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiration = NULL
     WHERE id = ?`
  ).run(hashWerkzeugScrypt(password), row.id);
  return NextResponse.json({ msg: 'Password updated' });
}
