import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, getUserByEmail } from '@/lib/db';

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({} as any));
  const email = (data.email || '').toString().trim().toLowerCase();
  const user = getUserByEmail(email);
  if (user) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db().prepare(
      'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE id = ?'
    ).run(token, expiry, user.id);
    // In dev we return the token so the UX is usable without an email service.
    return NextResponse.json({
      msg: 'Reset link generated',
      reset_url: `/resetPassBtn/${token}`,
    });
  }
  // Don't leak whether the email exists.
  return NextResponse.json({ msg: 'If the email exists, a reset link was sent' });
}
