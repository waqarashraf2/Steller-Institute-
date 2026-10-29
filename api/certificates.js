import { getDb, ensureTables } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, setNoStoreHeaders } from './_security.js';

export default async function handler(req, res) {
  setCorsHeaders(res, req, { isPublic: true });
  setSecurityHeaders(res);
  setNoStoreHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reg = req.query.reg || req.query.id || req.query.registration_no;
  if (typeof reg !== 'string' || !reg.trim()) {
    return res.status(400).json({ error: 'Registration number is required' });
  }

  try {
    await ensureTables();
    const db = getDb();
    const rows = await db`
      SELECT id, registration_no, student_name, cnic, course_title, course_duration, conducted_by,
             duration_from, duration_to, issue_date, principal_title, instructor_title, is_valid, created_at
      FROM certificates
      WHERE UPPER(registration_no) = UPPER(${reg.trim()})
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found', found: false });
    }

    return res.status(200).json({ found: true, certificate: rows[0] });
  } catch (err) {
    console.error('Certificates API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
