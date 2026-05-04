import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ─────────────────────────────────────────────────────────────
// Create tables if not exist + seed
// ─────────────────────────────────────────────────────────────
function ensurePackagesTable() {
  db().prepare(`
    CREATE TABLE IF NOT EXISTS packages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      price       REAL    NOT NULL,
      description TEXT,
      duration    INTEGER,
      tier         TEXT
    )
  `).run();

  db().prepare(`
    CREATE TABLE IF NOT EXISTS package_items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      item       TEXT    NOT NULL,
      FOREIGN KEY (package_id) REFERENCES packages(id)
    )
  `).run();

  const row = db().prepare(`SELECT COUNT(*) as n FROM packages`).get() as any;
  const count = row?.n || 0;

  if (count === 0) {
    seedPackages();
  }
}

// ─────────────────────────────────────────────────────────────
// Seed البيانات
// ─────────────────────────────────────────────────────────────
function seedPackages() {
  const insert = db().prepare(`
    INSERT INTO packages (name, price, description, duration, tier)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertItem = db().prepare(`
    INSERT INTO package_items (package_id, item) VALUES (?, ?)
  `);

  const seed = db().transaction(() => {

    // 1. Bridal Glam Package
    const p1 = insert.run(
      'Bridal / Group Packages',
      3000,
      'Complete bridal transformation for your special day',
      180,
      'Most Popular'
    );
    const p1id = Number(p1.lastInsertRowid);

    [
      'Full bridal makeup',
      'Hair styling',
      'False lashes',
      'Makeup trial session',
      'touch-up kit',
    ].forEach(item => insertItem.run(p1id, item));

    // 2. Evening Makeup
    const p2 = insert.run(
      'Premium - Makeup Artist or Hairdresser',
      1500,
      'Glamorous look for special occasions and events',
      90,
      null,
    );
    const p2id = Number(p2.lastInsertRowid);

    [
      'Evening makeup ',
      'Hair styling',
      'False lashes',
      'Consultation',
      '2-hours session',
    ].forEach(item => insertItem.run(p2id, item));

    // 3. Hair & Makeup Express
    const p3 = insert.run(
      'Regular - Makeup artist or Hairdresser',
      800,
      'Quick glam for busy schedules',
      60,
      null,
    );
    const p3id = Number(p3.lastInsertRowid);

    [
      'Natural makeup look',
      'Basic hair styling',
      'Blow-dry included',
      'Quick & efficient service',
    ].forEach(item => insertItem.run(p3id, item));
  });

  seed();
}

// ─────────────────────────────────────────────────────────────
// GET /api/packages
// ─────────────────────────────────────────────────────────────
export async function GET() {
  ensurePackagesTable();

  const packages = db().prepare(`
    SELECT * FROM packages ORDER BY price DESC
  `).all() as any[];

  const result = packages.map(pkg => {
    const items = db().prepare(`
      SELECT item FROM package_items WHERE package_id = ?
    `).all(pkg.id) as any[];

    return {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description,
      duration: pkg.duration,
      tier: pkg.tier,
      items: items.map(i => i.item),
    };
  });

  return NextResponse.json(result);
}