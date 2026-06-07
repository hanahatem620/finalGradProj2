import Database from 'better-sqlite3';
import path from 'path';

// Point to the same SQLite file used by the old Flask servers so existing
// users/bookings/providers all remain accessible.
const DB_PATH = path.resolve(process.cwd(), '..', '..', 'instance', 'glamngo.db');

let _db: Database.Database | null = null;
let _migrated = false;

export function db(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
  }
  if (!_migrated) {
    _migrated = true;
    try {
      backfillMissingArtistServices();
    } catch (e) {
      console.error('[db] backfill error:', e);
    }
  }
  return _db;
}

// ── Starter services for newly-approved artists ─────────────────────────────
// When an artist application is approved we promote the user to ARTIST but the
// `services` table stays empty, leaving the artist unbookable. These helpers
// seed a starter set of services from the application's specialties +
// priceRange so the artist is immediately listable / bookable. Idempotent.

const STARTER_DURATION = 60;
const STARTER_PRICE_FLOOR = 200;

function parseJsonArray(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    if (!Array.isArray(v)) return [];
    return v.map((x: any) => String(x).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function inferServiceType(title: string): string {
  return /hair/i.test(title) ? 'HAIR' : 'MAKEUP';
}

export function seedStarterServicesForUser(userId: number): number {
  if (!userId) return 0;
  const has = _db!.prepare(
    'SELECT 1 FROM services WHERE provider_id = ? LIMIT 1'
  ).get(userId) as any;
  if (has) return 0;

  const user = _db!.prepare(
    'SELECT email, role FROM users WHERE id = ?'
  ).get(userId) as any;
  if (!user) return 0;
  const role = (user.role || '').toUpperCase();
  if (role !== 'ARTIST' && role !== 'HAIRDRESSER') return 0;

  // Most-recent approved application linked to this user (by submitted_by or
  // email). Older Sarah/Layla rows live under both paths.
  const app = _db!.prepare(`
    SELECT specialties, services, price_range
    FROM artist_applications
    WHERE status = 'APPROVED'
      AND (submitted_by = ? OR LOWER(email) = LOWER(?))
    ORDER BY datetime(created_at) DESC
    LIMIT 1
  `).get(userId, user.email || '') as any;

  const specialties = parseJsonArray(app?.specialties);
  const categories  = parseJsonArray(app?.services);
  const basePrice   = Math.max(Number(app?.price_range) || 0, STARTER_PRICE_FLOOR);

  const application = db().prepare(`
  SELECT portfolio_description
  FROM artist_applications
  WHERE LOWER(email) = LOWER(?)
  ORDER BY id DESC
  LIMIT 1
`).get(user.email) as any;

  // Specialties carry real service titles (e.g. "Bridal Makeup"). The "services"
  // checklist on the application is mostly delivery modes (On-site, In-studio),
  // so fall back to a sensible default if specialties are blank.
  let titles = specialties;
  if (titles.length === 0) {
    const meaningful = categories.filter(c =>
      /lesson|treatment|consultation|group|booking/i.test(c)
    );
    titles = meaningful.length > 0
      ? meaningful
      : [role === 'HAIRDRESSER' ? 'Hair Styling' : 'Beauty Service'];
  }

  const ins = _db!.prepare(`
    INSERT INTO services (provider_id, type, title, description, duration, base_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  let inserted = 0;
  for (const title of titles) {
    ins.run(userId, inferServiceType(title), title, null, STARTER_DURATION, basePrice);
    inserted++;
  }
  return inserted;
}

export function backfillMissingArtistServices(): number {
  if (!_db) return 0;
  const broken = _db.prepare(`
    SELECT u.id FROM users u
    WHERE u.role IN ('ARTIST', 'HAIRDRESSER')
      AND u.status = 'ACTIVE'
      AND NOT EXISTS (SELECT 1 FROM services s WHERE s.provider_id = u.id)
  `).all() as any[];
  let total = 0;
  for (const r of broken) total += seedStarterServicesForUser(r.id);
  if (total > 0) {
    console.log(`[db] backfilled ${total} starter services across ${broken.length} artist(s)`);
  }
  return total;
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
   const application = db().prepare(`
  SELECT portfolio_description
  FROM artist_applications
  WHERE LOWER(email) = LOWER(?)
  ORDER BY id DESC
  LIMIT 1
`).get(userRow.email) as any;
  const base = serializeUser(userRow);
  const services = db().prepare(
    'SELECT * FROM services WHERE provider_id = ?'
  ).all(userRow.id) as any[];
  return {
    ...base,
    portfolio_description: application?.portfolio_description?? null,
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
