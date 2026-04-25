"use server";
import { db } from '@/lib/db';
import { hashWerkzeugScrypt } from '@/lib/password';

export async function resetUserPassword(token: string, password: string) {
  if (!token || !password) throw new Error('Missing token or password');
  const row = db().prepare(
    'SELECT id, reset_token_expiration FROM users WHERE reset_token = ?'
  ).get(token) as any;
  if (!row) throw new Error('Invalid token');
  const exp = row.reset_token_expiration ? new Date(row.reset_token_expiration) : null;
  if (!exp || exp.getTime() < Date.now()) throw new Error('Token expired');
  db().prepare(
    `UPDATE users SET password_hash = ?, reset_token = NULL,
                      reset_token_expiration = NULL WHERE id = ?`
  ).run(hashWerkzeugScrypt(password), row.id);
  return { msg: 'Password updated' };
}