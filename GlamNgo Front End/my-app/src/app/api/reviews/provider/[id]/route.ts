import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public: list reviews written for a specific provider, latest first.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const rows = db().prepare(`
    SELECT r.*, cp.name AS client_name
    FROM reviews r
    LEFT JOIN profiles cp ON cp.user_id = r.client_id
    WHERE r.provider_id = ?
    ORDER BY r.created_at DESC
  `).all(Number(id)) as any[];

  const avg = db().prepare(
    'SELECT AVG(rating) AS avg, COUNT(*) AS count FROM reviews WHERE provider_id = ?'
  ).get(Number(id)) as any;

  return NextResponse.json({
    average: avg?.avg ?? null,
    count: avg?.count ?? 0,
    reviews: rows.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      client_name: r.client_name || 'A client',
      created_at: r.created_at,
    })),
  });
}
