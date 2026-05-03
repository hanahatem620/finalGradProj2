import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';


// Run this once (or add it to your DB migration script):

function ensureFavoritesTable() {
  db().prepare(`
    CREATE TABLE IF NOT EXISTS favorites (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id  INTEGER NOT NULL,
      artist_id  INTEGER NOT NULL,
      created_at TEXT    NOT NULL,
      UNIQUE(client_id, artist_id),
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (artist_id) REFERENCES users(id)
    )
  `).run();
}

// GET /api/favorites

export async function GET() {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!session) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'client') return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });

  ensureFavoritesTable();

  // 1. Get all favorited artists for this client
  const favorites = db().prepare(`
    SELECT
      f.id          AS favorite_id,
      f.created_at  AS favorited_at,
      u.id          AS artist_id,
      u.role        AS artist_role,
      u.email       AS artist_email,
      p.name        AS artist_name,
      p.image_url   AS artist_image,
      p.location    AS artist_location,
      p.bio         AS artist_bio
    FROM favorites f
    JOIN users    u ON u.id = f.artist_id
    JOIN profiles p ON p.user_id = f.artist_id
    WHERE f.client_id = ?
    ORDER BY f.created_at DESC
  `).all(uid) as any[];

  // 2. For each artist — attach services and review stats
  const result = favorites.map(fav => {

    // Services: title + type
    const services = db().prepare(`
      SELECT id, title, type, base_price, duration
      FROM services
      WHERE provider_id = ?
      ORDER BY base_price ASC
    `).all(fav.artist_id) as any[];

    // Review stats: average stars + total count
    const reviewStats = db().prepare(`
      SELECT
        ROUND(AVG(rating), 1) AS average_stars,
        COUNT(*)              AS review_count
      FROM reviews
      WHERE provider_id = ?
    `).get(fav.artist_id) as { average_stars: number | null; review_count: number };

    return {
      favorite_id:   fav.favorite_id,
      favorited_at:  fav.favorited_at,
      artist: {
        id:       fav.artist_id,
        name:     fav.artist_name   || fav.artist_email?.split('@')[0],
        role:     fav.artist_role,
        email:    fav.artist_email,
        image:    fav.artist_image  || null,
        location: fav.artist_location || null,
        bio:      fav.artist_bio    || null,
      },
      services: services.map(s => ({
        id:         s.id,
        title:      s.title,
        type:       s.type,
        base_price: s.base_price,
        duration:   s.duration,
      })),
      reviews: {
        average_stars: reviewStats?.average_stars ?? 0,
        review_count:  reviewStats?.review_count  ?? 0,
      },
    };
  });

  return NextResponse.json({
    count: result.length,
    favorites: result,
  });
}

// POST /api/favorites

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!session) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'client') return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });

  ensureFavoritesTable();

  const body      = await req.json().catch(() => ({} as any));
  const artist_id = Number(body.artist_id);

  if (!artist_id) {
    return NextResponse.json({ error: 'artist_id is required' }, { status: 400 });
  }

  // Make sure the artist exists and has a valid provider role
  const artist = db().prepare(`
    SELECT id, role FROM users
    WHERE id = ? AND role IN ('ARTIST', 'HAIRDRESSER') AND status = 'ACTIVE'
  `).get(artist_id) as any;

  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  // Check if already favorited
  const existing = db().prepare(
    'SELECT id FROM favorites WHERE client_id = ? AND artist_id = ?'
  ).get(uid, artist_id);

  if (existing) {
    return NextResponse.json({ error: 'Artist already in favorites' }, { status: 409 });
  }

  const info = db().prepare(`
    INSERT INTO favorites (client_id, artist_id, created_at)
    VALUES (?, ?, ?)
  `).run(uid, artist_id, new Date().toISOString());

  return NextResponse.json(
    { id: Number(info.lastInsertRowid), artist_id, msg: 'Added to favorites' },
    { status: 201 }
  );
}

// DELETE /api/favorites

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const uid  = Number((session?.user as any)?.id);
  const role = ((session?.user as any)?.role || '').toLowerCase();

  if (!uid) return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  if (role !== 'client') return NextResponse.json({ msg: 'Forbidden' }, { status: 403 });

  ensureFavoritesTable();

  const body      = await req.json().catch(() => ({} as any));
  const artist_id = Number(body.artist_id);

  if (!artist_id) {
    return NextResponse.json({ error: 'artist_id is required' }, { status: 400 });
  }

  const info = db().prepare(
    'DELETE FROM favorites WHERE client_id = ? AND artist_id = ?'
  ).run(uid, artist_id);

  if (info.changes === 0) {
    return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
  }

  return NextResponse.json({ msg: 'Removed from favorites', artist_id });
}