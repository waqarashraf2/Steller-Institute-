import { getDb, ensureTables } from './_db.js';
import { setCorsHeaders, setSecurityHeaders, setNoStoreHeaders } from './_security.js';

export default async function handler(req, res) {
  // Public access enable karein taake external CRM fetch kar sake
  setCorsHeaders(res, req, { isPublic: true });
  setSecurityHeaders(res);
  setNoStoreHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await ensureTables();
  const db = getDb();

  try {
    const reg = req.query.reg || req.query.id || req.query.registration_no;

    // 1. Agar specific registration number diya gaya ho (Single Certificate Fetch/Verify)
    if (reg) {
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
    }

    // 2. Agar koi parameter na ho toh tamam certificates list return karein (CRM Auto-Pull)
    const allCertificates = await db`
      SELECT id, registration_no, student_name, cnic, course_title, course_duration, conducted_by,
             duration_from, duration_to, issue_date, principal_title, instructor_title, is_valid, created_at
      FROM certificates
      ORDER BY id DESC
    `;

    return res.status(200).json({
      success: true,
      count: allCertificates.length,
      certificates: allCertificates
    });

  } catch (err) {
    console.error('Certificates API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
