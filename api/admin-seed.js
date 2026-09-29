import { getDb, ensureTables } from './_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCorsHeaders, setSecurityHeaders, getJwtSecret, setNoStoreHeaders } from './_security.js';

// This endpoint now REQUIRES a valid admin JWT token.
// Only an existing admin can create new admin users.
function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), getJwtSecret());
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res, req);
  setSecurityHeaders(res);
  setNoStoreHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST' && req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  // REQUIRE admin authentication — no more static secret
  const admin = verifyToken(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Only existing admins can perform this action.' });
  }

  if (req.method === 'PUT') {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    try {
      await ensureTables();
      const db = getDb();
      const hashed = await bcrypt.hash(password, 12);
      await db`UPDATE admin_users SET password = ${hashed} WHERE id = ${admin.id}`;
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      console.error('Password update error:', err);
      return res.status(500).json({ error: 'Failed to update password' });
    }
  }

  const { username, password, name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    await ensureTables();
    const db = getDb();

    const existing = await db`SELECT id FROM admin_users WHERE username = ${username}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const rows = await db`
      INSERT INTO admin_users (username, password, name)
      VALUES (${username}, ${hashed}, ${name || username})
      RETURNING id, username, name
    `;

    return res.status(201).json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Seed error:', err);
    return res.status(500).json({ error: 'Failed to create admin user' });
  }
}
