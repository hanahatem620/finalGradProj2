import { NextResponse } from 'next/server';
import { db, getUserByEmail } from '@/lib/db';
import { hashWerkzeugScrypt } from '@/lib/password';

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({} as any));
  const email = (data.email || '').toString().trim().toLowerCase();
  const password = (data.password || '').toString();
  const name = (data.name || '').toString().trim();
  if (!email || !password) {
    return NextResponse.json({ msg: 'Email and password required' }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return NextResponse.json({ msg: 'Email already registered' }, { status: 409 });
  }
  try {
    const hashed = hashWerkzeugScrypt(password);
    const tx = db().transaction((e: string, h: string, n: string) => {
      const info = db().prepare(
        `INSERT INTO users (email, role, status, password_hash, created_at)
         VALUES (?, 'CLIENT', 'ACTIVE', ?, ?)`
      ).run(e, h, new Date().toISOString());
      const userId = Number(info.lastInsertRowid);
      db().prepare(
        'INSERT INTO profiles (user_id, name) VALUES (?, ?)'
      ).run(userId, n || e.split('@')[0]);
      return userId;
    });
    const userId = tx(email, hashed, name);
    return NextResponse.json({ msg: 'Account created', id: userId }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ msg: e?.message || 'Registration failed' }, { status: 500 });
  }
}
