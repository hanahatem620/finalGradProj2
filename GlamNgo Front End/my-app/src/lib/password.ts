import crypto from 'crypto';

// Werkzeug 3.x default: `scrypt:N:r:p$salt$hex_digest` with a 64-byte digest.
// We implement verify + hash here so users created by either Flask (legacy)
// or Next.js (new) can authenticate in both systems during the migration.

const MAXMEM = 256 * 1024 * 1024; // scrypt N=32768,r=8 needs ~64MB

export function verifyWerkzeugHash(password: string, storedHash: string): boolean {
  try {
    const [method, salt, hexDigest] = storedHash.split('$');
    if (!method || !salt || !hexDigest) return false;
    const parts = method.split(':');
    if (parts[0] === 'scrypt') {
      const N = parseInt(parts[1], 10);
      const r = parseInt(parts[2], 10);
      const p = parseInt(parts[3], 10);
      const keyLen = hexDigest.length / 2;
      const derived = crypto.scryptSync(password, salt, keyLen, { N, r, p, maxmem: MAXMEM });
      return crypto.timingSafeEqual(
        Buffer.from(derived.toString('hex'), 'hex'),
        Buffer.from(hexDigest, 'hex'),
      );
    }
    if (parts[0] === 'pbkdf2') {
      // Format: pbkdf2:sha256:iterations
      const algo = parts[1];
      const iterations = parseInt(parts[2], 10);
      const keyLen = hexDigest.length / 2;
      const derived = crypto.pbkdf2Sync(password, salt, iterations, keyLen, algo);
      return crypto.timingSafeEqual(
        Buffer.from(derived.toString('hex'), 'hex'),
        Buffer.from(hexDigest, 'hex'),
      );
    }
    return false;
  } catch {
    return false;
  }
}

export function hashWerkzeugScrypt(password: string): string {
  const N = 32768, r = 8, p = 1;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const rnd = crypto.randomBytes(16);
  let salt = '';
  for (let i = 0; i < 16; i++) salt += alphabet[rnd[i] % alphabet.length];
  const derived = crypto.scryptSync(password, salt, 64, { N, r, p, maxmem: MAXMEM });
  return `scrypt:${N}:${r}:${p}$${salt}$${derived.toString('hex')}`;
}
