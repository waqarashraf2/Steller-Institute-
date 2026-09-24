import { getDb, ensureTables } from '../api/_db.js';
import { itCourses, beautyCourses } from '../src/data/courses.js';

export default async function handler(req, res) {
  try {
    await ensureTables();
    const db = getDb();
    
    // Check if already seeded
    const existing = await db`SELECT id FROM courses LIMIT 1`;
    if (existing.length > 0) {
      return res.status(200).json({ message: 'Courses already seeded!' });
    }

    for (const c of itCourses) {
      // Map frontend URLs like "/images_courses/..." to absolute URLs or keep them relative.
      // Keeping relative is better since the site handles it.
      await db`INSERT INTO courses (category, title, duration, image_url, banner_url) VALUES ('it', ${c.title}, ${c.duration || null}, ${c.image || null}, ${c.bannerImage || null})`;
    }
    for (const c of beautyCourses) {
      await db`INSERT INTO courses (category, title, duration, image_url, banner_url) VALUES ('beauty', ${c.title}, ${c.duration || null}, ${c.image || null}, ${c.bannerImage || null})`;
    }
    
    return res.status(200).json({ message: 'Courses seeded successfully!' });
  } catch (err) {
    console.error('Migration Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
