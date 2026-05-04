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

export function createNotification(input: CreateNotificationInput): number {
  ensureTable();
  const info = db().prepare(`
    INSERT INTO notifications (user_id, type, title, body, action_url, created_at)
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

export function safeNotify(input: CreateNotificationInput): void {
  try {
    createNotification(input);
  } catch (err) {
    console.error('[notify] failed:', err);
  }
}
