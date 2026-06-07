import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
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

function findService(providerId: number, serviceId: number) {
  return db().prepare(
    `SELECT id, provider_id, type, title, description, duration, base_price
     FROM services WHERE id = ? AND provider_id = ?`
  ).get(serviceId, providerId) as any
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; serviceId: string }> },
) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id: idParam, serviceId: sidParam } = await ctx.params
  const providerId = Number(idParam)
  const serviceId = Number(sidParam)
  if (!providerId || !serviceId) {
    return NextResponse.json({ msg: 'Bad id' }, { status: 400 })
  }
  const existing = findService(providerId, serviceId)
  if (!existing) {
    return NextResponse.json({ msg: 'Service not found' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({} as any))
  const sets: string[] = []
  const args: any[] = []

  if ('title' in body) {
    const t = (body.title || '').toString().trim()
    if (!t) return NextResponse.json({ msg: 'Title cannot be empty' }, { status: 400 })
    sets.push('title = ?'); args.push(t)
  }
  if ('type' in body) {
    const t = (body.type || '').toString().toUpperCase()
    if (!TYPES.has(t)) {
      return NextResponse.json({ msg: 'Type must be MAKEUP or HAIR' }, { status: 400 })
    }
    sets.push('type = ?'); args.push(t)
  }
  if ('description' in body) {
    const v = body.description == null ? null : body.description.toString().trim() || null
    sets.push('description = ?'); args.push(v)
  }
  if ('duration' in body) {
    const d = Number(body.duration)
    if (!Number.isFinite(d) || d <= 0) {
      return NextResponse.json({ msg: 'Duration must be a positive number' }, { status: 400 })
    }
    sets.push('duration = ?'); args.push(d)
  }
  if ('base_price' in body) {
    const p = Number(body.base_price)
    if (!Number.isFinite(p) || p < 0) {
      return NextResponse.json({ msg: 'Price must be zero or greater' }, { status: 400 })
    }
    sets.push('base_price = ?'); args.push(p)
  }

  if (sets.length === 0) {
    return NextResponse.json(existing)
  }

  db().prepare(`UPDATE services SET ${sets.join(', ')} WHERE id = ?`).run(...args, serviceId)
  const updated = findService(providerId, serviceId)
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; serviceId: string }> },
) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id: idParam, serviceId: sidParam } = await ctx.params
  const providerId = Number(idParam)
  const serviceId = Number(sidParam)
  if (!providerId || !serviceId) {
    return NextResponse.json({ msg: 'Bad id' }, { status: 400 })
  }
  const existing = findService(providerId, serviceId)
  if (!existing) {
    return NextResponse.json({ msg: 'Service not found' }, { status: 404 })
  }

  // Block deletion if the service is referenced by an existing booking item —
  // historical receipts and admin booking detail rely on the FK staying intact.
  const refCount = (db().prepare(
    `SELECT COUNT(*) c FROM booking_items WHERE service_id = ?`
  ).get(serviceId) as any)?.c || 0
  if (refCount > 0) {
    return NextResponse.json(
      { msg: 'This service is used by existing bookings and cannot be deleted. Edit it instead.' },
      { status: 409 },
    )
  }

  db().prepare(`DELETE FROM services WHERE id = ?`).run(serviceId)
  return NextResponse.json({ msg: 'Deleted' })
}
