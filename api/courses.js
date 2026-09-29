import { getDb, ensureTables, ensureCourseColumns } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, getJwtSecret, setPublicCacheHeaders, setNoStoreHeaders } from './_security.js';
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

const MAX_POSTGRES_INT = 2147483647;

function parsePrice(value) {
  if (value === undefined || value === null || value === '') return 0;
  if (!/^\d+$/.test(String(value).trim())) return null;

  const price = Number(value);
  return Number.isSafeInteger(price) && price <= MAX_POSTGRES_INT ? price : null;
}

function parseCourseId(value) {
  if (value === undefined || value === null || value === '') return null;
  if (!/^\d+$/.test(String(value).trim())) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= MAX_POSTGRES_INT ? id : null;
}

export default async function handler(req, res) {
  setCorsHeaders(res, req, { isPublic: req.method === 'GET' });
  setSecurityHeaders(res);
  setNoStoreHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTables();
    await ensureCourseColumns();
    const db = getDb();

    // PUBLIC ENDPOINT: Fetch all courses
    if (req.method === 'GET') {
      setPublicCacheHeaders(res);
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
      if (typeof category !== 'string' || !category.trim() || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Category and title are required' });
      }

      const parsedBasePrice = parsePrice(base_price);
      const parsedDiscountPrice = parsePrice(discount_price);
      if (special_offer_tag !== undefined && special_offer_tag !== null && typeof special_offer_tag !== 'string') {
        return res.status(400).json({ error: 'Offer tag must be text' });
      }
      const offerTag = typeof special_offer_tag === 'string' ? special_offer_tag.trim() : '';
      if (parsedBasePrice === null || parsedDiscountPrice === null) {
        return res.status(400).json({ error: 'Prices must be whole numbers between 0 and 2147483647' });
      }
      if (offerTag.length > 100) {
        return res.status(400).json({ error: 'Offer tag must be 100 characters or fewer' });
      }

      const rows = await db`
        INSERT INTO courses (category, title, duration, image_url, banner_url, base_price, discount_price, special_offer_tag)
        VALUES (
          ${category.trim()},
          ${title.trim()},
          ${duration || null},
          ${image_url || null},
          ${banner_url || null},
          ${parsedBasePrice},
          ${parsedDiscountPrice},
          ${offerTag || null}
        )
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const {
        id: suppliedId,
        original_title,
        category,
        title,
        duration,
        image_url,
        banner_url,
        base_price,
        discount_price,
        special_offer_tag
      } = req.body;
      const hasId = suppliedId !== undefined && suppliedId !== null && suppliedId !== '';
      const id = parseCourseId(suppliedId);
      if (hasId && !id) return res.status(400).json({ error: 'A valid course ID is required' });
      if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: 'A valid course title is required' });
      }
      if (original_title !== undefined && (typeof original_title !== 'string' || !original_title.trim())) {
        return res.status(400).json({ error: 'A valid original course title is required' });
      }
      if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
        return res.status(400).json({ error: 'A valid course category is required' });
      }

      const parsedBasePrice = base_price === undefined ? null : parsePrice(base_price);
      const parsedDiscountPrice = discount_price === undefined ? null : parsePrice(discount_price);
      const offerTag = typeof special_offer_tag === 'string' ? special_offer_tag.trim() : '';
      if (parsedBasePrice === null && base_price !== undefined) {
        return res.status(400).json({ error: 'Base price must be a whole number between 0 and 2147483647' });
      }
      if (parsedDiscountPrice === null && discount_price !== undefined) {
        return res.status(400).json({ error: 'Discount price must be a whole number between 0 and 2147483647' });
      }
      if (special_offer_tag !== undefined && special_offer_tag !== null && typeof special_offer_tag !== 'string') {
        return res.status(400).json({ error: 'Offer tag must be text' });
      }
      if (offerTag && offerTag.length > 100) {
        return res.status(400).json({ error: 'Offer tag must be 100 characters or fewer' });
      }

      let courseId = id;
      if (!courseId) {
        const lookupTitle = typeof original_title === 'string' && original_title.trim()
          ? original_title.trim()
          : title?.trim();
        if (!lookupTitle) return res.status(400).json({ error: 'A course ID or title is required' });
        const matches = await db`
          SELECT id FROM courses
          WHERE LOWER(TRIM(title)) = LOWER(TRIM(${lookupTitle}))
          ORDER BY id ASC
          LIMIT 2
        `;
        if (matches.length === 0) return res.status(404).json({ error: 'Course not found' });
        if (matches.length > 1) return res.status(409).json({ error: 'Course title is ambiguous; refresh and edit by ID' });
        courseId = matches[0].id;
      }

      const rows = await db`
        UPDATE courses
        SET
          category = COALESCE(${category}, category),
          title = COALESCE(${title?.trim() || null}, title),
          duration = ${duration ?? null},
          image_url = ${image_url ?? null},
          banner_url = ${banner_url ?? null},
          base_price = COALESCE(${parsedBasePrice}, base_price),
          discount_price = COALESCE(${parsedDiscountPrice}, discount_price),
          special_offer_tag = CASE
            WHEN ${special_offer_tag === undefined} THEN special_offer_tag
            ELSE ${offerTag || null}
          END
        WHERE id = ${courseId}
        RETURNING *
      `;
      if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = parseCourseId(req.body?.id);
      if (!id) return res.status(400).json({ error: 'A valid course ID is required' });

      const deleted = await db`DELETE FROM courses WHERE id = ${id} RETURNING id`;
      if (deleted.length === 0) return res.status(404).json({ error: 'Course not found' });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
