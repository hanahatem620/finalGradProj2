import { NextResponse } from 'next/server';
import { db, serializeProvider } from '@/lib/db';

export async function GET() {
  const rows = db().prepare(`
    SELECT u.*, p.name AS p_name, p.bio AS p_bio, p.image_url AS p_image_url,
           p.location AS p_location, p.contact_info AS p_contact_info
    FROM users u LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.role IN ('ARTIST','HAIRDRESSER') AND u.status = 'ACTIVE'
    ORDER BY u.role, u.email
  `).all() as any[];
  return NextResponse.json(rows.map(serializeProvider));
}
