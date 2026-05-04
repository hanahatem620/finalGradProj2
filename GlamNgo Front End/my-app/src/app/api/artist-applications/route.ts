import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth'
import fs from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'
import { safeNotify } from '@/lib/notification'


const UPLOADS_DIR = path.resolve(process.cwd(), '..', '..', 'uploads')
const ID_DIR = path.join(UPLOADS_DIR, 'artist-id-cards')
const ALLOWED_EXT = new Set(['png', 'jpg', 'jpeg', 'pdf', 'webp'])

function ensureTable() {
  db().prepare(`
    CREATE TABLE IF NOT EXISTS artist_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      years_of_experience INTEGER,
      specialties TEXT,
      certifications TEXT,
      license TEXT,
      services TEXT,
      price_range REAL,
      travel_range REAL,
      portfolio_description TEXT,
      instagram TEXT,
      website TEXT,
      id_card_url TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      reject_reason TEXT,
      reviewed_by INTEGER,
      reviewed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `).run()
}

function s(v: FormDataEntryValue | null): string | null {
  if (v == null) return null
  const t = v.toString().trim()
  return t.length ? t : null
}

function n(v: FormDataEntryValue | null): number | null {
  const t = s(v)
  if (t === null) return null
  const num = Number(t)
  return Number.isFinite(num) ? num : null
}

function jsonArray(v: FormDataEntryValue | null): string | null {
  const t = s(v)
  if (t === null) return null
  try {
    const parsed = JSON.parse(t)
    if (Array.isArray(parsed)) return JSON.stringify(parsed)
  } catch {
    /* fall through */
  }
  // Tolerate comma-separated as a fallback
  return JSON.stringify(t.split(',').map(x => x.trim()).filter(Boolean))
}

// POST: must be logged in. Application is linked to the submitting user so
// they can be notified about the outcome.
export async function POST(req: Request) {
  ensureTable()

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { msg: 'You must be signed in to apply.', code: 'UNAUTHENTICATED' },
      { status: 401 }
    )
  }
  const submittedBy = Number((session.user as any).id)
  const submitterRole = ((session.user as any).role || '').toLowerCase()
  if (submitterRole === 'artist' || submitterRole === 'hairdresser') {
    return NextResponse.json(
      { msg: "You're already an artist on GlamNgo." },
      { status: 400 }
    )
  }
  if (submitterRole === 'admin' || submitterRole === 'manager') {
    return NextResponse.json(
      { msg: 'Admins cannot submit artist applications.' },
      { status: 400 }
    )
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ msg: 'Invalid form' }, { status: 400 })

  const firstName = s(form.get('firstName'))
  const lastName = s(form.get('lastName'))
  const formEmail = s(form.get('email'))?.toLowerCase() ?? null
  const email = formEmail || (session.user.email || '').toLowerCase() || null
  const phone = s(form.get('phone'))

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { msg: 'First name, last name, and email are required' },
      { status: 400 }
    )
  }

  // Reject duplicate pending applications from the same submitter
  const dup = db().prepare(
    `SELECT id FROM artist_applications
     WHERE status = 'PENDING' AND (submitted_by = ? OR LOWER(email) = LOWER(?))`
  ).get(submittedBy, email) as any
  if (dup) {
    return NextResponse.json(
      { msg: 'You already have a pending application — please wait for review.' },
      { status: 409 }
    )
  }

  // Optional ID card upload
  let idCardUrl: string | null = null
  const idFile = form.get('idCard')
  if (idFile instanceof File && idFile.size > 0) {
    if (idFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ msg: 'ID card too large (max 10MB)' }, { status: 413 })
    }
    const ext = (idFile.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { msg: 'Unsupported ID file type (use png, jpg, pdf, webp)' },
        { status: 400 }
      )
    }
    await fs.mkdir(ID_DIR, { recursive: true })
    const safe = `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    await fs.writeFile(path.join(ID_DIR, safe), Buffer.from(await idFile.arrayBuffer()))
    idCardUrl = `artist-id-cards/${safe}`
  }

  const created_at = new Date().toISOString()
  const info = db().prepare(`
    INSERT INTO artist_applications
      (first_name, last_name, email, phone, years_of_experience,
       specialties, certifications, license, services, price_range,
       travel_range, portfolio_description, instagram, website,
       id_card_url, status, created_at, submitted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
  `).run(
    firstName,
    lastName,
    email,
    phone,
    n(form.get('yearsOfExperience')),
    jsonArray(form.get('specialties')),
    s(form.get('certifications')),
    s(form.get('license')),
    jsonArray(form.get('services')),
    n(form.get('priceRange')),
    n(form.get('travelRange')),
    s(form.get('portfolioDescription')),
    s(form.get('instagram')),
    s(form.get('website')),
    idCardUrl,
    created_at,
    submittedBy,
  )

  // Notify all admin users
  const admins = db().prepare(
    `SELECT id FROM users WHERE LOWER(role) IN ('admin','manager')`
  ).all() as any[]
  for (const a of admins) {
    safeNotify({
      user_id: a.id,
      type: 'SYSTEM',
      title: 'New Artist Application',
      body: `${firstName} ${lastName} applied to become an artist.`,
      action_url: '/admin/applications',
    })
  }

  return NextResponse.json(
    { id: Number(info.lastInsertRowid), status: 'PENDING' },
    { status: 201 }
  )
}

// GET: admin only — list applications (filter by ?status=)
export async function GET(req: Request) {
  ensureTable()
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 })
  }
  const role = ((session.user as any).role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get('status')

  const sql = status
    ? `SELECT * FROM artist_applications WHERE status = ? ORDER BY created_at DESC`
    : `SELECT * FROM artist_applications ORDER BY created_at DESC`
  const rows = (status
    ? db().prepare(sql).all(status)
    : db().prepare(sql).all()) as any[]

  // Decode JSON fields for the client
  const out = rows.map(r => ({
    ...r,
    specialties: r.specialties ? safeJson(r.specialties) : [],
    services: r.services ? safeJson(r.services) : [],
  }))

  const counts = db().prepare(
    `SELECT status, COUNT(*) as c FROM artist_applications GROUP BY status`
  ).all() as any[]
  const summary = { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<string, number>
  for (const c of counts) summary[c.status] = c.c

  return NextResponse.json({ applications: out, summary })
}

function safeJson(s: string): any {
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}
