import { getDb, ensureTables } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, setPublicCacheHeaders } from './_security.js';

export default async function handler(req, res) {
  setCorsHeaders(res, req, { isPublic: true });
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  await ensureTables();
  const db = getDb();

  try {
    if (req.method === 'GET') {
      setPublicCacheHeaders(res);
      const slug = req.query?.slug || req.url.split('slug=')[1]?.split('&')[0];
      if (slug) {
        const rows = await db`SELECT * FROM site_pages WHERE slug = ${slug}`;
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(rows[0]);
      }
      
      const rows = await db`SELECT * FROM site_pages`;
      return res.status(200).json(rows);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Pages public error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
