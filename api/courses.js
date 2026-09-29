import { getDb, ensureTables } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, getJwtSecret } from './_security.js';
import jwt from 'jsonwebtoken';

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

  try {
    await ensureTables();
    const db = getDb();

    // PUBLIC ENDPOINT: Fetch all courses
    if (req.method === 'GET') {
      const courses = await db`SELECT * FROM courses ORDER BY created_at ASC`;
      return res.status(200).json(courses);
    }

    // ADMIN AUTH REQUIRED for POST, PUT, DELETE
    const admin = verifyToken(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { category, title, duration, image_url, banner_url, base_price, discount_price, special_offer_tag } = req.body;
      if (!category || !title) {
        return res.status(400).json({ error: 'Category and title are required' });
      }

      const rows = await db`
        INSERT INTO courses (category, title, duration, image_url, banner_url, base_price, discount_price, special_offer_tag)
        VALUES (
          ${category}, 
          ${title}, 
          ${duration || null}, 
          ${image_url || null}, 
          ${banner_url || null}, 
          ${base_price ? parseInt(base_price) : 0}, 
          ${discount_price ? parseInt(discount_price) : 0}, 
          ${special_offer_tag || null}
        )
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, category, title, duration, image_url, banner_url, base_price, discount_price, special_offer_tag } = req.body;
      if (!id && !title) return res.status(400).json({ error: 'ID or Title is required' });

      const parsedBasePrice = base_price !== undefined ? (base_price ? parseInt(base_price) : 0) : 0;
      const parsedDiscountPrice = discount_price !== undefined ? (discount_price ? parseInt(discount_price) : 0) : 0;

      const isNumericId = id && !isNaN(Number(id)) && Number.isInteger(Number(id)) && Number(id) < 2147483647;

      let rows;
      if (isNumericId) {
        rows = await db`
          UPDATE courses
          SET 
            category = COALESCE(${category}, category),
            title = COALESCE(${title}, title),
            duration = ${duration},
            image_url = ${image_url},
            banner_url = ${banner_url},
            base_price = ${parsedBasePrice},
            discount_price = ${parsedDiscountPrice},
            special_offer_tag = ${special_offer_tag || null}
          WHERE id = ${Number(id)}
          RETURNING *
        `;
      } else {
        const existing = await db`SELECT id FROM courses WHERE LOWER(TRIM(title)) = LOWER(TRIM(${title})) LIMIT 1`;
        if (existing.length > 0) {
          rows = await db`
            UPDATE courses
            SET 
              category = COALESCE(${category}, category),
              duration = ${duration},
              image_url = ${image_url},
              banner_url = ${banner_url},
              base_price = ${parsedBasePrice},
              discount_price = ${parsedDiscountPrice},
              special_offer_tag = ${special_offer_tag || null}
            WHERE id = ${existing[0].id}
            RETURNING *
          `;
        } else {
          rows = await db`
            INSERT INTO courses (category, title, duration, image_url, banner_url, base_price, discount_price, special_offer_tag)
            VALUES (
              ${category || 'it'}, 
              ${title}, 
              ${duration || null}, 
              ${image_url || null}, 
              ${banner_url || null}, 
              ${parsedBasePrice}, 
              ${parsedDiscountPrice}, 
              ${special_offer_tag || null}
            )
            RETURNING *
          `;
        }
      }
      return res.status(200).json(rows[0] || { success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      await db`DELETE FROM courses WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
