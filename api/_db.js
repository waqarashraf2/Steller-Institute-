import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

let sql;

export function getDb() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export async function ensureTables() {
  const db = getDb();

  await db`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body TEXT,
      type VARCHAR(20) DEFAULT 'both',
      priority VARCHAR(20) DEFAULT 'normal',
      link_url VARCHAR(500),
      link_text VARCHAR(100),
      image_url TEXT,
      is_active BOOLEAN DEFAULT true,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(150)
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS website_images (
      id SERIAL PRIMARY KEY,
      placeholder_key VARCHAR(100) NOT NULL UNIQUE,
      image_url TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(100),
      image_url TEXT,
      banner_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS site_pages (
      slug VARCHAR(100) PRIMARY KEY,
      content TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS certificates (
      id SERIAL PRIMARY KEY,
      registration_no VARCHAR(100) NOT NULL UNIQUE,
      student_name VARCHAR(255) NOT NULL,
      cnic VARCHAR(50),
      course_title VARCHAR(255) NOT NULL,
      course_duration VARCHAR(255) DEFAULT 'A 3-Month Professional Course Conducted by Stellar Institute.',
      duration_from DATE,
      duration_to DATE,
      conducted_by VARCHAR(255) DEFAULT 'Stellar Institute.',
      issue_date DATE DEFAULT CURRENT_DATE,
      principal_title VARCHAR(255) DEFAULT 'Stellar Institute & Academy',
      instructor_title VARCHAR(255) DEFAULT 'Stellar Institute',
      is_valid BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Safely ensure columns exist on existing databases
  try {
    await db`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS cnic VARCHAR(50)`;
    await db`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS duration_from DATE`;
    await db`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS duration_to DATE`;
  } catch {}

  const targetPass = process.env.ADMIN_DEFAULT_PASS;
  if (!targetPass) {
    return;
  }
  const existingAdmin = await db`SELECT id FROM admin_users WHERE username = 'admin'`;
  if (existingAdmin.length === 0) {
    const hashed = await bcrypt.hash(targetPass, 12);
    await db`
      INSERT INTO admin_users (username, password, name)
      VALUES ('admin', ${hashed}, 'Admin')
    `;
  }
}
