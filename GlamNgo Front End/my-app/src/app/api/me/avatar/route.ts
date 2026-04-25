import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import fs from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

const UPLOADS_DIR = path.resolve(process.cwd(), '..', '..', 'uploads')
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars')
const ALLOWED = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp'])

// Ensure the hardcoded bootstrap admin (id=0) has a real DB row so it can
// actually persist a profile/avatar. Returns the real user id to use.
function ensureAdminRow(email: string, name: string): number {
  const existing = db().prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)')
    .get(email) as any
  if (existing) return existing.id
  // Create with a nonsense password hash — this account still authenticates via
  // the hardcoded branch of auth.ts, but now has a DB row for profile data.
  const info = db().prepare(
    `INSERT INTO users (email, role, status, password_hash, created_at)
     VALUES (?, 'ADMIN', 'ACTIVE', 'bootstrap:no-password', ?)`
  ).run(email, new Date().toISOString())
  const id = Number(info.lastInsertRowid)
  db().prepare('INSERT INTO profiles (user_id, name) VALUES (?, ?)').run(id, name)
  return id
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 })
  }

  let uid = Number((session.user as any).id)
  if (uid === 0) {
    uid = ensureAdminRow(session.user.email || 'admin@glamngo.com',
                         session.user.name || 'Admin')
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ msg: 'Invalid form' }, { status: 400 })
  const file = form.get('avatar')
  if (!(file instanceof File)) {
    return NextResponse.json({ msg: 'No file uploaded' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ msg: 'File too large (max 5MB)' }, { status: 413 })
  }
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!ALLOWED.has(ext)) {
    return NextResponse.json({ msg: 'Unsupported image type' }, { status: 400 })
  }

  await fs.mkdir(AVATARS_DIR, { recursive: true })
  const safe = `avatar_${uid}_${Date.now()}.${ext}`
  const filePath = path.join(AVATARS_DIR, safe)
  const buf = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buf)

  const relUrl = `avatars/${safe}`

  // Remove previous avatar file, upsert profile.image_url
  const existingProfile = db().prepare(
    'SELECT image_url FROM profiles WHERE user_id = ?'
  ).get(uid) as any
  if (existingProfile?.image_url) {
    try { await fs.unlink(path.join(UPLOADS_DIR, existingProfile.image_url)) }
    catch { /* already gone — fine */ }
  }
  if (existingProfile) {
    db().prepare('UPDATE profiles SET image_url = ? WHERE user_id = ?')
      .run(relUrl, uid)
  } else {
    db().prepare(
      'INSERT INTO profiles (user_id, image_url) VALUES (?, ?)'
    ).run(uid, relUrl)
  }

  return NextResponse.json({ image_url: relUrl, path: `/uploads/${relUrl}` })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 })
  }
  let uid = Number((session.user as any).id)
  if (uid === 0) {
    uid = ensureAdminRow(session.user.email || 'admin@glamngo.com',
                         session.user.name || 'Admin')
  }
  const row = db().prepare('SELECT image_url FROM profiles WHERE user_id = ?')
    .get(uid) as any
  if (row?.image_url) {
    try { await fs.unlink(path.join(UPLOADS_DIR, row.image_url)) }
    catch { /* already gone */ }
    db().prepare('UPDATE profiles SET image_url = NULL WHERE user_id = ?').run(uid)
  }
  return NextResponse.json({ msg: 'Avatar removed' })
}
