import { getDb, ensureTables } from './_db.js';
import jwt from 'jsonwebtoken';
import { setCorsHeaders, setSecurityHeaders, getJwtSecret, setNoStoreHeaders } from './_security.js';

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
  setCorsHeaders(res, req, { isPublic: false });
  setSecurityHeaders(res);
  setNoStoreHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  await ensureTables();
  const db = getDb();

  try {
    if (req.method === 'POST') {
      const { slug, content } = req.body;
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const rows = await db`
        INSERT INTO site_pages (slug, content)
        VALUES (${slug}, ${content || ''})
        ON CONFLICT (slug) DO UPDATE
        SET content = EXCLUDED.content, updated_at = NOW()
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin pages error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
