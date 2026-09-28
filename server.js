import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables for local development. Vercel injects production env vars.
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Configure this more strictly based on your needs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── API Routes (local Express adapter for the shared Vercel handlers) ───────

// The shared handler modules use the same HTTP request/response shape here.
const wrapHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Import all API handlers
import adminLoginHandler from './api/admin-login.js';
import adminSeedHandler from './api/admin-seed.js';
import adminAnnouncementsHandler from './api/admin-announcements.js';
import adminImagesHandler from './api/admin-images.js';
import adminPagesHandler from './api/admin-pages.js';
import adminCertificatesHandler from './api/admin-certificates.js';
import coursesHandler from './api/courses.js';
import announcementsHandler from './api/announcements.js';
import certificatesHandler from './api/certificates.js';
import contactHandler from './api/contact.js';
import pagesHandler from './api/pages.js';

// Map endpoints
app.all('/api/admin-login', wrapHandler(adminLoginHandler));
app.all('/api/admin-seed', wrapHandler(adminSeedHandler));
app.all('/api/admin-announcements', wrapHandler(adminAnnouncementsHandler));
app.all('/api/admin-images', wrapHandler(adminImagesHandler));
app.all('/api/admin-pages', wrapHandler(adminPagesHandler));
app.all('/api/admin-certificates', wrapHandler(adminCertificatesHandler));
app.all('/api/courses', wrapHandler(coursesHandler));
app.all('/api/announcements', wrapHandler(announcementsHandler));
app.all('/api/certificates', wrapHandler(certificatesHandler));
app.all('/api/contact', wrapHandler(contactHandler));
app.all('/api/pages', wrapHandler(pagesHandler));

// ─── Serve React Static Files in the optional local Express adapter ─────────

// The shared cPanel host serves the built files with Apache/LiteSpeed and does not
// run this Node.js server.
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
