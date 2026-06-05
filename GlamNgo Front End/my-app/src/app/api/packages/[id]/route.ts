import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = Number(params.id);

    const pkg = db()
      .prepare(`
        SELECT id, name, price, description
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
        SELECT id, name
        FROM users
        WHERE role = 'artist'
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