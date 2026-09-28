# Stellar Academy

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, Framer Motion |
| API | Node.js handlers in `api/`; Vercel runs them as serverless functions |
| Database | Neon Postgres (Serverless) |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Hosting | Vercel APIs; cPanel static site and PHP form endpoints |

The API files do not opt into Vercel's Edge Runtime. The Vercel deployment uses Node.js functions.
The cPanel shared host serves the static frontend and PHP forms. Database-backed requests for courses,
announcements, images, pages, certificates, and admin data continue to use Vercel's Node.js functions and Neon.

## Project Structure

```
stellar_institute/
├── api/                    # Vercel Node.js functions / shared Express handlers
│   ├── _db.js              # Neon Postgres connection + table setup
│   ├── _security.js        # Shared CORS, auth, rate-limit, and response headers
│   ├── courses.js          # Public course reads + protected CRUD
│   ├── certificates.js     # Public certificate verification
│   ├── admin-certificates.js # Protected certificate CRUD (includes CNIC)
│   ├── announcements.js    # Public GET for active announcements
│   ├── admin-login.js      # JWT login endpoint
│   ├── admin-announcements.js  # Protected CRUD for announcements
│   ├── admin-seed.js       # One-time admin user seeder
│   ├── pages.js            # Public CMS page reads
│   └── contact.js          # Vercel contact email handler
├── server.js               # Express adapter for running API handlers on Node.js
├── public/api/             # cPanel PHP contact and admission handlers
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Multi-level dropdown navigation
│   │   ├── Footer.jsx      # Site footer with social links
│   │   ├── AnnouncementPopup.jsx   # Auto-popup modal
│   │   ├── AnnouncementTicker.jsx  # Scrolling notice strip
│   │   ├── AnnouncementModal.jsx   # Detailed notice viewer
│   │   ├── CursorTrail.jsx # Custom cursor effect
│   │   ├── FloatingShapes.jsx # Animated SVG decorations
│   │   ├── ScrollReveal.jsx   # Scroll-triggered animations
│   │   ├── StatsCounter.jsx   # Animated number counter
│   │   └── CampusCarousel.jsx # Image carousel
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── SkilledInstitute.jsx # Course catalog
│   │   ├── Academy.jsx     # Academic programs
│   │   ├── About.jsx       # About us
│   │   ├── Contact.jsx     # Contact form
│   │   ├── StellarAdmin.jsx # Admin dashboard
│   │   └── ComingSoon.jsx  # Placeholder
│   └── data/
│       └── courses.js      # Course data + testimonials
├── public/                 # Static assets (logo, images)
├── vercel.json             # Vercel routing config
└── package.json
```

## Environment Variables

These need to be set in the Vercel dashboard (or `.env` for local dev):

```
DATABASE_URL=postgresql://...          # Neon Postgres connection string
JWT_SECRET=your-secret-key             # For admin auth tokens
ADMIN_DEFAULT_PASS=your-initial-password # Seeds the first admin only when no admin exists

# Optional — for contact form emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@stellarinstitute.pk
```

## Running Locally

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The API routes require Vercel CLI (`vercel dev`) to work locally since they're serverless functions.

## Deployment

Vercel is connected to GitHub, so pushing or merging to `main` can trigger a deployment. Review that branch before merging.

`scripts/deploy_cpanel.sh` builds and uploads static `dist/` files and copies the `api/` source directory.
The shared cPanel host does not run Node.js, so those copied handlers are not the active API there.
`.htaccess` rewrites `/api/contact` to the PHP contact handler; the admission form posts directly to
`/api/admission.php`. Other database-backed browser API calls use Vercel, as the script's default
`VITE_API_URL` specifies. Keep that split; setting `VITE_API_URL=/api` would send those requests to
static cPanel paths that cannot execute the Node.js handlers.
