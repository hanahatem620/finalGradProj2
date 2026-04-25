import { NextResponse } from 'next/server';
import { db, serializeProvider } from '@/lib/db';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const row = db().prepare(`
    SELECT u.*, p.name AS p_name, p.bio AS p_bio, p.image_url AS p_image_url,
           p.location AS p_location, p.contact_info AS p_contact_info
    FROM users u LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ?
  `).get(Number(id)) as any;
  if (!row) return NextResponse.json({ msg: 'Not found' }, { status: 404 });
  return NextResponse.json(serializeProvider(row));
}
