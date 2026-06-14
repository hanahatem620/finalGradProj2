import { db } from '@/lib/db';

export type NotificationType =
  | 'BOOKING_NEW'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'REVIEW_NEW'
  | 'SUPPORT_REPLY'
  | 'SYSTEM';

export interface CreateNotificationInput {
  user_id: number;
  type: NotificationType;
  title: string;
  body: string;
  action_url?: string | null;
}

// ─── preferences helper ─────────────────────
function getPreferences(userId: number) {
  return db()
    .prepare(`
      SELECT 
        new_booking_requests,
        appointment_reminders,
        system_updates
      FROM notification_preferences
      WHERE user_id = ?
    `)
    .get(userId) as {
      new_booking_requests: number;
      appointment_reminders: number;
      system_updates: number;
    } | undefined;
}

export function notifyNewBooking({
  artistId,
  clientName,
  date,
  location,
  actionUrl,
}: {
  artistId: number
  clientName: string
  date: string
  location: string
  actionUrl?: string
}) {
  safeNotify({
    user_id: artistId,
    type: 'BOOKING_NEW',
    title: `New booking from ${clientName}`,
    body: `📅 ${date} • 📍 ${location}`,
    action_url: actionUrl ?? '/providers/bookings',
  })
}

// ─── table ─────────────────────
function ensureTable() {
  db().prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      action_url TEXT,
      created_at TEXT NOT NULL
    )
  `).run();
}

// ─── main insert ─────────────────────
export function createNotification(input: CreateNotificationInput): number {
  ensureTable();

  const info = db().prepare(`
    INSERT INTO notifications 
      (user_id, type, title, body, action_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    input.user_id,
    input.type,
    input.title,
    input.body,
    input.action_url ?? null,
    new Date().toISOString(),
  );

  return Number(info.lastInsertRowid);
}

// ─── safe notify (IMPORTANT PART) ─────────────────────
export function safeNotify(input: CreateNotificationInput): void {
  try {
    const prefs = getPreferences(input.user_id);

    // لو مفيش prefs → نكمل عادي
    if (!prefs) {
      createNotification(input);
      return;
    }

    // ─── mapping rules ───
    const allowed =
      (input.type === 'BOOKING_NEW' && prefs.new_booking_requests) ||
      ((input.type === 'BOOKING_CANCELLED' ||
        input.type === 'BOOKING_COMPLETED') &&
        prefs.appointment_reminders) ||
      (input.type === 'SYSTEM' && prefs.system_updates) ||
      input.type === 'PAYMENT_RECEIVED' ||
      input.type === 'REVIEW_NEW' ||
      input.type === 'SUPPORT_REPLY';

    if (!allowed) return;

    createNotification(input);
  } catch (err) {
    console.error('[notify] failed:', err);
  }
}