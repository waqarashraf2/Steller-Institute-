import { getDb, ensureTables } from './_db.js';
import jwt from 'jsonwebtoken';
import { setCorsHeaders, setSecurityHeaders, getJwtSecret } from './_security.js';

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
  setCorsHeaders(res, req, { isPublic: req.method === 'GET' });
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  await ensureTables();
  const db = getDb();

  try {
    // GET is public (frontend needs images) but only returns safe fields
    if (req.method === 'GET') {
      const rows = await db`SELECT id, placeholder_key, image_url FROM website_images`;
      return res.status(200).json(rows);
    }

    // POST and DELETE require admin auth
    if (req.method === 'POST') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { placeholder_key, image_url } = req.body;
      if (!placeholder_key || !image_url) {
        return res.status(400).json({ error: 'Key and image URL required' });
      }

      const rows = await db`
        INSERT INTO website_images (placeholder_key, image_url)
        VALUES (${placeholder_key}, ${image_url})
        ON CONFLICT (placeholder_key) DO UPDATE
        SET image_url = EXCLUDED.image_url, updated_at = NOW()
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID required' });

      await db`DELETE FROM website_images WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin images error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
