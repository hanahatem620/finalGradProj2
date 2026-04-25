import Database from 'better-sqlite3';
import path from 'path';

// Point to the same SQLite file used by the old Flask servers so existing
// users/bookings/providers all remain accessible.
const DB_PATH = path.resolve(process.cwd(), '..', '..', 'instance', 'glamngo.db');

let _db: Database.Database | null = null;

export function db(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
  }
  return _db;
}

// ── Row → API shape mappers ──────────────────────────────────────────────────

export interface UserRow {
  id: number;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  password_hash: string;
  created_at: string | null;
  reset_token?: string | null;
  reset_token_expiration?: string | null;
}

export interface ProfileRow {
  id: number;
  user_id: number;
  name: string | null;
  bio: string | null;
  image_url: string | null;
  location: string | null;
  contact_info: string | null;
}

export function userWithProfile(userId: number) {
  const row = db().prepare(`
    SELECT u.*, p.name AS p_name, p.bio AS p_bio, p.image_url AS p_image_url,
           p.location AS p_location, p.contact_info AS p_contact_info
    FROM users u LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ?
  `).get(userId) as any;
  if (!row) return null;
  return serializeUser(row);
}

function displayName(row: any): string {
  if (row.p_name) return row.p_name;
  const email: string = row.email || '';
  return email.split('@')[0] || 'User';
}

export function serializeUser(row: any) {
  return {
    id: row.id,
    user_id: row.id,
    email: row.email,
    phone: row.phone,
    role: (row.role || '').toLowerCase(),
    status: row.status,
    name: displayName(row),
    bio: row.p_bio ?? null,
    image_url: row.p_image_url ?? null,
    location: row.p_location ?? null,
    contact_info: row.p_contact_info ?? null,
    discount: 0,
    created_at: row.created_at,
  };
}

export function serializeProvider(userRow: any) {
  const base = serializeUser(userRow);
  const services = db().prepare(
    'SELECT * FROM services WHERE provider_id = ?'
  ).all(userRow.id) as any[];
  return {
    ...base,
    services: services.map(s => ({
      id: s.id,
      provider_id: s.provider_id,
      type: s.type,
      title: s.title,
      description: s.description,
      duration: s.duration,
      base_price: s.base_price,
    })),
    packages: [],
  };
}

export function getUserByEmail(email: string): any | null {
  return db().prepare(`
    SELECT u.*, p.name AS p_name, p.bio AS p_bio, p.image_url AS p_image_url,
           p.location AS p_location, p.contact_info AS p_contact_info
    FROM users u LEFT JOIN profiles p ON p.user_id = u.id
    WHERE LOWER(u.email) = LOWER(?)
  `).get(email);
}
