import { getDb, ensureTables } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, setPublicCacheHeaders } from './_security.js';

export default async function handler(req, res) {
  setCorsHeaders(res, req, { isPublic: true });
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  setPublicCacheHeaders(res);

  try {
    await ensureTables();
    const db = getDb();

    const rows = await db`
      SELECT id, title, body, type, priority, link_url, link_text, image_url, start_date, end_date, created_at
      FROM announcements
      WHERE is_active = true
        AND (start_date IS NULL OR start_date <= CURRENT_DATE)
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
      ORDER BY
        CASE priority WHEN 'urgent' THEN 0 WHEN 'important' THEN 1 ELSE 2 END,
        created_at DESC
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error('Announcements error:', err);
    return res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
