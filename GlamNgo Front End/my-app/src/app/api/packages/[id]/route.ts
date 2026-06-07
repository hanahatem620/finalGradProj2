import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = Number(id);

    const pkg = db()
      .prepare(`
        SELECT id, name, price, description, duration
        FROM packages
        WHERE id = ?
      `)
      .get(packageId);

    if (!pkg) {
      return NextResponse.json(
        { msg: 'Package not found' },
        { status: 404 }
      );
    }

    const artists = db()
      .prepare(`
        SELECT
          u.id,
          p.name,
          u.role
        FROM users u
        INNER JOIN profiles p
          ON p.user_id = u.id
        WHERE u.role IN ('ARTIST', 'HAIRDRESSER')
        ORDER BY p.name
      `)
      .all();

    return NextResponse.json({
      package: pkg,
      artists,
    });

  } catch (e: any) {
    return NextResponse.json(
      { msg: e.message || 'Error fetching package' },
      { status: 500 }
    );
  }
}