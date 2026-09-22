import { getDb, ensureTables } from './_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCorsHeaders, setSecurityHeaders, rateLimit, getJwtSecret, getClientIp } from './_security.js';

export default async function handler(req, res) {
  setCorsHeaders(res, req);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: 5 login attempts per IP per 15 minutes
  const ip = getClientIp(req);
  const { limited, retryAfter } = rateLimit(`login:${ip}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (limited) {
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({ error: `Too many login attempts. Try again in ${retryAfter} seconds.` });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    await ensureTables();
    const db = getDb();

    const rows = await db`SELECT * FROM admin_users WHERE username = ${username}`;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      getJwtSecret(),
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}
