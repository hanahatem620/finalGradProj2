import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../auth'
import { db } from '@/lib/db'

const TYPES = new Set(['MAKEUP', 'HAIR'])

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: NextResponse.json({ msg: 'Unauthorized' }, { status: 401 }) }
  }
  const role = ((session.user as any).role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return { error: NextResponse.json({ msg: 'Forbidden' }, { status: 403 }) }
  }
  return { session }
}

function ensureProvider(providerId: number) {
  const row = db().prepare(
    `SELECT id, role FROM users WHERE id = ?`
  ).get(providerId) as any
  if (!row) return null
  const role = (row.role || '').toUpperCase()
  if (role !== 'ARTIST' && role !== 'HAIRDRESSER') return null
  return row
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await ctx.params
  const providerId = Number(idParam)
  if (!providerId) {
    return NextResponse.json({ msg: 'Bad id' }, { status: 400 })
  }
  const rows = db().prepare(
    `SELECT id, provider_id, type, title, description, duration, base_price
     FROM services WHERE provider_id = ? ORDER BY id`
  ).all(providerId)
  return NextResponse.json(rows)
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id: idParam } = await ctx.params
  const providerId = Number(idParam)
  if (!providerId) {
    return NextResponse.json({ msg: 'Bad id' }, { status: 400 })
  }
  if (!ensureProvider(providerId)) {
    return NextResponse.json({ msg: 'Provider not found' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({} as any))
  const title = (body.title || '').toString().trim()
  const type = (body.type || 'MAKEUP').toString().toUpperCase()
  const description = body.description == null ? null : body.description.toString().trim() || null
  const duration = Number(body.duration)
  const basePrice = Number(body.base_price)

  if (!title) {
    return NextResponse.json({ msg: 'Title is required' }, { status: 400 })
  }
  if (!TYPES.has(type)) {
    return NextResponse.json({ msg: 'Type must be MAKEUP or HAIR' }, { status: 400 })
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    return NextResponse.json({ msg: 'Duration must be a positive number' }, { status: 400 })
  }
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return NextResponse.json({ msg: 'Price must be zero or greater' }, { status: 400 })
  }

  const info = db().prepare(
    `INSERT INTO services (provider_id, type, title, description, duration, base_price)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(providerId, type, title, description, duration, basePrice)

  const row = db().prepare(
    `SELECT id, provider_id, type, title, description, duration, base_price
     FROM services WHERE id = ?`
  ).get(Number(info.lastInsertRowid))
  return NextResponse.json(row, { status: 201 })
}
