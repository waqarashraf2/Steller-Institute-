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
  setCorsHeaders(res, req);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  await ensureTables();
  const db = getDb();

  try {
    if (req.method === 'GET') {
      const rows = await db`
        SELECT * FROM announcements ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { title, body, type, priority, link_url, link_text, image_url, is_active, start_date, end_date } = req.body;

      if (!title) return res.status(400).json({ error: 'Title is required' });

      const rows = await db`
        INSERT INTO announcements (title, body, type, priority, link_url, link_text, image_url, is_active, start_date, end_date)
        VALUES (
          ${title},
          ${body || null},
          ${type || 'both'},
          ${priority || 'normal'},
          ${link_url || null},
          ${link_text || null},
          ${image_url || null},
          ${is_active !== false},
          ${start_date || null},
          ${end_date || null}
        )
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, title, body, type, priority, link_url, link_text, image_url, is_active, start_date, end_date } = req.body;

      if (!id) return res.status(400).json({ error: 'ID is required' });

      const rows = await db`
        UPDATE announcements SET
          title = ${title},
          body = ${body || null},
          type = ${type || 'both'},
          priority = ${priority || 'normal'},
          link_url = ${link_url || null},
          link_text = ${link_text || null},
          image_url = ${image_url || null},
          is_active = ${is_active !== false},
          start_date = ${start_date || null},
          end_date = ${end_date || null}
        WHERE id = ${id}
        RETURNING *
      `;

      if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      await db`DELETE FROM announcements WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin announcements error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
