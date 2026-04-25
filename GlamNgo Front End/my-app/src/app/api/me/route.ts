import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { userWithProfile } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }
  const uid = Number(session.user.id);
  if (uid === 0) {
    return NextResponse.json({
      id: 0, user_id: 0, email: 'admin@glamngo.com', name: 'Admin',
      role: 'admin', status: 'ACTIVE', phone: null, bio: null,
      image_url: null, location: null, contact_info: null, discount: 0,
      created_at: new Date().toISOString(),
    });
  }
  const user = userWithProfile(uid);
  if (!user) return NextResponse.json({ msg: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}
