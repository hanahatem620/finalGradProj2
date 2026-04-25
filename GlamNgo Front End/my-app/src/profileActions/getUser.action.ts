'use server'
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';
import { userWithProfile } from '@/lib/db';

export async function getUser() {
  const session = await getServerSession(authOptions);
  const uid = Number((session?.user as any)?.id);
  if (!uid && uid !== 0) return null;
  if (uid === 0) {
    return {
      id: 0, user_id: 0, email: 'admin@glamngo.com', name: 'Admin',
      role: 'admin', status: 'ACTIVE', phone: null, bio: null,
      image_url: null, location: null, contact_info: null, discount: 0,
      created_at: new Date().toISOString(),
    };
  }
  return userWithProfile(uid);
}