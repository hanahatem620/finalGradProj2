'use server'
import crypto from 'crypto';
import { db, getUserByEmail } from '@/lib/db';

export async function forgotUserPass({ email }: { email: string }) {
    const cleaned = (email || '').trim().toLowerCase();
    const user = getUserByEmail(cleaned);
    if (user) {
        const token = crypto.randomBytes(24).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        db().prepare(
            'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE id = ?'
        ).run(token, expiry, user.id);
        return { msg: 'Reset link generated', reset_url: `/resetPassBtn/${token}` };
    }
    return { msg: 'If the email exists, a reset link was sent' };
}