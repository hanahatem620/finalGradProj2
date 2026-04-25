import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { db, userWithProfile } from '@/lib/db';

// PATCH: update the current user's profile fields (name/bio/location/contact).
// Avatars continue to live as files under /uploads — separate endpoint TBD.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const name = body.name?.toString().trim() || null;
  const bio = body.bio?.toString().trim() || null;
  const location = body.location?.toString().trim() || null;
  const contact = body.contact_info?.toString().trim() || null;

  const existing = db().prepare('SELECT id FROM profiles WHERE user_id = ?')
    .get(uid) as any;
  if (existing) {
    db().prepare(
      `UPDATE profiles SET name = ?, bio = ?, location = ?, contact_info = ?
       WHERE user_id = ?`
    ).run(name, bio, location, contact, uid);
  } else {
    db().prepare(
      `INSERT INTO profiles (user_id, name, bio, location, contact_info)
       VALUES (?, ?, ?, ?, ?)`
    ).run(uid, name, bio, location, contact);
  }
  return NextResponse.json(userWithProfile(uid));
}
