import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import { db } from '@/lib/db'
import { safeNotify } from '@/lib/notification'


// PATCH: admin only — approve or reject an application
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 })
  }
  const role = ((session.user as any).role || '').toLowerCase()
  if (role !== 'admin' && role !== 'manager') {
    return NextResponse.json({ msg: 'Forbidden' }, { status: 403 })
  }
  // Resolve a *real* admin user id for the reviewed_by FK. Older JWTs from the
  // hardcoded admin path can carry id="0" (or some other id that no longer
  // exists in users); fall back to looking up by email so we never violate the
  // FK on reviewed_by.
  let adminId: number | null = null
  const sessionIdRaw = Number((session.user as any).id)
  if (Number.isFinite(sessionIdRaw)) {
    const exists = db().prepare('SELECT id FROM users WHERE id = ?').get(sessionIdRaw) as any
    if (exists) adminId = sessionIdRaw
  }
  if (adminId == null && session.user.email) {
    const row = db().prepare(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?)'
    ).get(session.user.email) as any
    if (row) adminId = row.id
  }

  const { id: idParam } = await ctx.params
  const id = Number(idParam)
  if (!id) return NextResponse.json({ msg: 'Bad id' }, { status: 400 })

  const body = await req.json().catch(() => ({} as any))
  const action = (body.action || '').toString().toLowerCase()
  const reason = (body.reason || '').toString().trim() || null

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ msg: 'action must be approve or reject' }, { status: 400 })
  }

  const app = db().prepare(`SELECT * FROM artist_applications WHERE id = ?`).get(id) as any
  if (!app) return NextResponse.json({ msg: 'Not found' }, { status: 404 })
  if (app.status !== 'PENDING') {
    return NextResponse.json(
      { msg: `Already ${app.status.toLowerCase()}` },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()
  const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

  // Find the applicant's user record. Prefer the explicit submitted_by link;
  // fall back to email match for legacy rows.
  let applicantUserId: number | null = null
  if (app.submitted_by) {
    const row = db().prepare('SELECT id FROM users WHERE id = ?').get(app.submitted_by) as any
    if (row) applicantUserId = row.id
  }
  if (!applicantUserId && app.email) {
    const row = db().prepare(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?)'
    ).get(app.email) as any
    if (row) applicantUserId = row.id
  }

  if (action === 'approve') {
    if (applicantUserId) {
      // Promote existing account to artist
      db().prepare(
        `UPDATE users SET role = 'ARTIST', status = 'ACTIVE' WHERE id = ?`
      ).run(applicantUserId)
      // Make sure they have a profile row with their applied name + portfolio bio
      const profile = db().prepare(
        'SELECT user_id FROM profiles WHERE user_id = ?'
      ).get(applicantUserId) as any
      if (profile) {
        db().prepare(
          `UPDATE profiles
             SET name = COALESCE(NULLIF(name, ''), ?),
                 bio  = COALESCE(NULLIF(bio,  ''), ?)
           WHERE user_id = ?`
        ).run(`${app.first_name} ${app.last_name}`, app.portfolio_description, applicantUserId)
      } else {
        db().prepare(
          `INSERT INTO profiles (user_id, name, bio, contact_info)
           VALUES (?, ?, ?, ?)`
        ).run(
          applicantUserId,
          `${app.first_name} ${app.last_name}`,
          app.portfolio_description,
          app.phone,
        )
      }
    } else if (app.email) {
      // No submitter and no existing account — bootstrap a placeholder so the
      // applicant can claim it via password reset.
      const info = db().prepare(
        `INSERT INTO users (email, phone, role, status, password_hash, created_at)
         VALUES (?, ?, 'ARTIST', 'ACTIVE', 'pending:set-via-reset', ?)`
      ).run(app.email, app.phone, now)
      applicantUserId = Number(info.lastInsertRowid)
      db().prepare(
        `INSERT INTO profiles (user_id, name, bio, contact_info)
         VALUES (?, ?, ?, ?)`
      ).run(
        applicantUserId,
        `${app.first_name} ${app.last_name}`,
        app.portfolio_description,
        app.phone,
      )
    }
  }

  db().prepare(`
    UPDATE artist_applications
       SET status = ?, reject_reason = ?, reviewed_by = ?, reviewed_at = ?
     WHERE id = ?
  `).run(newStatus, action === 'reject' ? reason : null, adminId, now, id)

  // Notify the applicant with concrete next steps
  if (applicantUserId) {
    if (action === 'approve') {
      safeNotify({
        user_id: applicantUserId,
        type: 'SYSTEM',
        title: 'You are now a GlamNgo Artist!',
        body:
          'Your application was approved. Next steps: ' +
          '1) Sign out and back in to refresh your account. ' +
          '2) Add services and prices from your dashboard. ' +
          '3) Set your weekly availability so clients can book you.',
        action_url: '/artistApp',
      })
    } else {
      safeNotify({
        user_id: applicantUserId,
        type: 'SYSTEM',
        title: 'Artist application update',
        body:
          (reason ? `Your application wasn't approved: ${reason}. ` : 'Your application wasn\'t approved this time. ') +
          'You can update your details and re-apply at any time from the Become an Artist page.',
        action_url: '/becomeAPro',
      })
    }
  }

  return NextResponse.json({
    msg: 'OK',
    status: newStatus,
    user_id: applicantUserId,
  })
}
