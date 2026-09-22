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
  setCorsHeaders(res, req, { isPublic: false });
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  await ensureTables();
  const db = getDb();

  try {
    if (req.method === 'GET') {
      const rows = await db`
        SELECT * FROM certificates 
        ORDER BY id DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const {
        id,
        registration_no,
        student_name,
        course_title,
        course_duration,
        conducted_by,
        issue_date,
        principal_title,
        instructor_title,
        is_valid
      } = req.body;

      if (!registration_no || !student_name || !course_title) {
        return res.status(400).json({ error: 'Registration No, Student Name, and Course Title are required' });
      }

      if (id) {
        // Update existing certificate
        const rows = await db`
          UPDATE certificates
          SET 
            registration_no = ${registration_no.trim()},
            student_name = ${student_name.trim()},
            course_title = ${course_title.trim()},
            course_duration = ${course_duration || 'A 3-Month Professional Course Conducted by Stellar Institute.'},
            conducted_by = ${conducted_by || 'Stellar Institute.'},
            issue_date = ${issue_date || new Date().toISOString().split('T')[0]},
            principal_title = ${principal_title || 'Stellar Institute & Academy'},
            instructor_title = ${instructor_title || 'Stellar Institute'},
            is_valid = ${is_valid !== undefined ? is_valid : true}
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(rows[0]);
      } else {
        // Insert new certificate
        const rows = await db`
          INSERT INTO certificates (
            registration_no, student_name, course_title, course_duration, conducted_by,
            issue_date, principal_title, instructor_title, is_valid
          ) VALUES (
            ${registration_no.trim()},
            ${student_name.trim()},
            ${course_title.trim()},
            ${course_duration || 'A 3-Month Professional Course Conducted by Stellar Institute.'},
            ${conducted_by || 'Stellar Institute.'},
            ${issue_date || new Date().toISOString().split('T')[0]},
            ${principal_title || 'Stellar Institute & Academy'},
            ${instructor_title || 'Stellar Institute'},
            ${is_valid !== undefined ? is_valid : true}
          )
          ON CONFLICT (registration_no) DO UPDATE
          SET
            student_name = EXCLUDED.student_name,
            course_title = EXCLUDED.course_title,
            course_duration = EXCLUDED.course_duration,
            conducted_by = EXCLUDED.conducted_by,
            issue_date = EXCLUDED.issue_date,
            principal_title = EXCLUDED.principal_title,
            instructor_title = EXCLUDED.instructor_title,
            is_valid = EXCLUDED.is_valid
          RETURNING *
        `;
        return res.status(201).json(rows[0]);
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Certificate ID is required' });

      await db`DELETE FROM certificates WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin certificates error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
