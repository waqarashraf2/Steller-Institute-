import dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });
import { getDb, ensureTables } from './api/_db.js';
import { itCourses, beautyCourses } from './src/data/courses.js';

async function seed() {
  await ensureTables();
  const db = getDb();
  
  // Check if already seeded
  const existing = await db`SELECT id FROM courses LIMIT 1`;
  if (existing.length > 0) {
    console.log('Courses already seeded!');
    process.exit(0);
  }

  for (const c of itCourses) {
    await db`INSERT INTO courses (category, title, duration, image_url, banner_url) VALUES ('it', ${c.title}, ${c.duration}, ${c.image || null}, ${c.bannerImage || null})`;
  }
  for (const c of beautyCourses) {
    await db`INSERT INTO courses (category, title, duration, image_url, banner_url) VALUES ('beauty', ${c.title}, ${c.duration}, ${c.image || null}, ${c.bannerImage || null})`;
  }
  console.log('Courses seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);
