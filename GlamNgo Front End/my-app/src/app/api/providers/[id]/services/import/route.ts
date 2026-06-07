import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../auth'
import { db } from '@/lib/db'
import { getCatalogByKey, SERVICE_CATALOG } from '@/lib/serviceCatalog'
import { CatalogEntry } from '@/types/catalogEntry.type'
// import { SERVICE_CATALOG, getCatalogByKey, type CatalogEntry } from '@/lib/serviceCatalog'

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

function isProvider(id: number): boolean {
  const row = db().prepare('SELECT role FROM users WHERE id = ?').get(id) as any
  if (!row) return false
  const role = (row.role || '').toUpperCase()
  return role === 'ARTIST' || role === 'HAIRDRESSER'
}

interface ImportRow {
  type: string
  title: string
  description: string | null
  duration: number
  base_price: number
}

// POST: sync a target artist's services with a chosen source. Adds new
// services (catalog or another artist), and optionally removes existing
// services by id. The whole operation runs in one transaction.
//
// Body (any subset):
//   catalog_keys?: string[]                  — entries to add from the catalog
//   price_overrides?: { [key]: number }      — per-catalog-key price override
//   source_provider_id?: number              — for artist-mode imports
//   service_ids?: number[]                   — IDs from the source artist
//   remove_service_ids?: number[]            — services to delete on the target
//   price_multiplier?: number                — applied to add prices
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id: idParam } = await ctx.params
  const targetId = Number(idParam)
  if (!targetId || !isProvider(targetId)) {
    return NextResponse.json({ msg: 'Target provider not found' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({} as any))
  const multiplier = Number(body.price_multiplier)
  const factor = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1

  // ── Validate removals ─────────────────────────────────────────────────────
  // IDs must belong to this provider and must not be referenced by any
  // booking_items (those are needed for historical receipts).
  const removeIds: number[] = Array.isArray(body.remove_service_ids)
    ? body.remove_service_ids
        .map((n: any) => Number(n))
        .filter((n: number) => Number.isFinite(n) && n > 0)
    : []
  const toRemove: { id: number; title: string }[] = []
  const removalBlocked: { id: number; title: string }[] = []
  for (const sid of removeIds) {
    const own = db().prepare(
      'SELECT id, title FROM services WHERE id = ? AND provider_id = ?',
    ).get(sid, targetId) as any
    if (!own) continue
    const refCount = (db().prepare(
      'SELECT COUNT(*) c FROM booking_items WHERE service_id = ?',
    ).get(sid) as any)?.c || 0
    if (refCount > 0) {
      removalBlocked.push({ id: own.id, title: own.title })
      continue
    }
    toRemove.push({ id: own.id, title: own.title })
  }

  // ── Resolve additions: catalog vs artist ──────────────────────────────────
  const catalogKeys: string[] = Array.isArray(body.catalog_keys)
    ? body.catalog_keys.map((k: any) => String(k)).filter(Boolean)
    : []
  const overrides: Record<string, number> =
    body.price_overrides && typeof body.price_overrides === 'object'
      ? body.price_overrides
      : {}
  const sourceProviderId = Number(body.source_provider_id)
  const sourceServiceIds: number[] = Array.isArray(body.service_ids)
    ? body.service_ids
        .map((n: any) => Number(n))
        .filter((n: number) => Number.isFinite(n) && n > 0)
    : []

  let rows: ImportRow[] = []
  let mode: 'catalog' | 'artist' | 'remove-only' = 'remove-only'

  if (catalogKeys.length > 0) {
    mode = 'catalog'
    const seen = new Set<string>()
    const missing: string[] = []
    for (const k of catalogKeys) {
      if (seen.has(k)) continue
      seen.add(k)
      const entry: CatalogEntry | undefined = getCatalogByKey(k)
      if (!entry) { missing.push(k); continue }
      const overrideRaw = overrides[k]
      const overridePrice =
        overrideRaw != null && Number.isFinite(Number(overrideRaw)) && Number(overrideRaw) >= 0
          ? Number(overrideRaw)
          : entry.base_price
      const finalPrice = Math.round(overridePrice * factor * 100) / 100
      rows.push({
        type: entry.type,
        title: entry.title,
        description: entry.description,
        duration: entry.duration,
        base_price: finalPrice,
      })
    }
    if (missing.length > 0) {
      return NextResponse.json(
        { msg: `Unknown catalog entries: ${missing.join(', ')}` },
        { status: 400 },
      )
    }
  } else if (sourceProviderId || sourceServiceIds.length > 0) {
    mode = 'artist'
    if (!sourceProviderId || !isProvider(sourceProviderId)) {
      return NextResponse.json({ msg: 'Source provider not found' }, { status: 400 })
    }
    if (sourceProviderId === targetId) {
      return NextResponse.json(
        { msg: 'Source and target must be different artists' },
        { status: 400 },
      )
    }
    if (sourceServiceIds.length === 0) {
      return NextResponse.json(
        { msg: 'Select at least one service to import' },
        { status: 400 },
      )
    }
    const placeholders = sourceServiceIds.map(() => '?').join(',')
    const sourceServices = db().prepare(
      `SELECT id, type, title, description, duration, base_price
       FROM services
       WHERE provider_id = ? AND id IN (${placeholders})`
    ).all(sourceProviderId, ...sourceServiceIds) as any[]
    rows = sourceServices.map(s => ({
      type: s.type,
      title: s.title,
      description: s.description,
      duration: s.duration,
      base_price: Math.round(Number(s.base_price || 0) * factor * 100) / 100,
    }))
  }

  if (rows.length === 0 && toRemove.length === 0 && removalBlocked.length === 0) {
    return NextResponse.json(
      { msg: 'Nothing to add or remove' },
      { status: 400 },
    )
  }

  // ── Apply changes atomically ──────────────────────────────────────────────
  const existingTitles = new Set(
    (db().prepare('SELECT title FROM services WHERE provider_id = ?')
       .all(targetId) as any[])
      .map(r => (r.title || '').toLowerCase()),
  )

  const ins = db().prepare(`
    INSERT INTO services (provider_id, type, title, description, duration, base_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const del = db().prepare('DELETE FROM services WHERE id = ? AND provider_id = ?')

  const inserted: any[] = []
  const skipped: string[] = []
  const removed: { id: number; title: string }[] = []

  const txn = db().transaction(() => {
    // Remove first so a same-title swap (rename + re-add) works in one pass.
    for (const r of toRemove) {
      del.run(r.id, targetId)
      removed.push(r)
      existingTitles.delete((r.title || '').toLowerCase())
    }
    for (const s of rows) {
      const key = (s.title || '').toLowerCase()
      if (existingTitles.has(key)) {
        skipped.push(s.title)
        continue
      }
      const info = ins.run(
        targetId,
        s.type,
        s.title,
        s.description,
        s.duration,
        s.base_price,
      )
      inserted.push({
        id: Number(info.lastInsertRowid),
        provider_id: targetId,
        type: s.type,
        title: s.title,
        description: s.description,
        duration: s.duration,
        base_price: s.base_price,
      })
      existingTitles.add(key)
    }
  })
  txn()

  return NextResponse.json({
    mode,
    inserted,
    inserted_count: inserted.length,
    skipped,
    skipped_count: skipped.length,
    removed,
    removed_count: removed.length,
    removal_blocked: removalBlocked,
    removal_blocked_count: removalBlocked.length,
    catalog_total: SERVICE_CATALOG.length,
  })
}
