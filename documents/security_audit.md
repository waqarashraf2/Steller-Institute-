# Stellar Institute — Security and Deployment Review

Review date: 2026-09-29
Scope: repository source, dependency lockfile, GitHub deployment workflow, the cPanel document root and Apache configuration inspected over SSH, and production route/deployment checks.
Limit: Vercel project settings, production environment variables, Neon data, live form submissions, and email delivery were not inspected or exercised.

## Hosting model

- The frontend is a React/Vite single-page app. The cPanel host serves the built static files and PHP contact/admission handlers.
- Vercel runs the `api/*.js` handlers as Node.js functions. The handlers do not opt into Vercel's Edge Runtime.
- Neon Postgres is the database used by the Vercel handlers. Keep `VITE_API_URL` pointed at the Vercel API for database-backed pages; setting it to cPanel `/api` would direct those calls to a host that cannot run the Node handlers.
- The GitHub workflow builds with Node 22 and deploys to cPanel when `main` changes. The Vercel project is also connected to GitHub, so a merge to `main` may deploy there too.
- SSH inspection confirmed the primary document root is `/home/stellarinstitute/public_html`; the account home is writable by its cPanel user.

## Current controls verified in source

- `JWT_SECRET` has no hardcoded fallback. Admin login fails if it is not configured.
- `admin-seed` requires an existing admin JWT; it no longer accepts a static provisioning secret.
- `.env`, `.env.*`, and production environment files are ignored by Git.
- API and Vercel responses set security headers. Admin responses use `Cache-Control: private, no-store`.
- The public image endpoint returns only its public image fields. Admin mutations still require a JWT.
- Neon queries reviewed here use parameterized tagged-template queries.
- PHP mail failures no longer return PHP's internal error details to the caller.
- The PHP contact and admission handlers enforce five POSTs per client IP per form per 15-minute window. File-locked state and a random HMAC key live under the account home, outside the document root. Cloudflare's client-IP header is trusted only when the connecting peer is in Cloudflare's published IPv4/IPv6 ranges.
- Admin default-password configuration seeds an admin only when no `admin` record exists; it no longer resets that account's password on each table initialization.
- Public certificate lookup intentionally returns the student's full CNIC. This is an explicit product requirement from the site owner. The endpoint remains public by registration number and is marked `private, no-store` to avoid intermediary/browser caching; this does not mask or restrict the CNIC.

## Findings and remaining risks

### 1. PHP forms now have a shared-host rate limit

`public/api/contact.php` and `public/api/admission.php` now reject the sixth POST from the same client IP to the same form during a 15-minute window with HTTP 429 and `Retry-After`. The file lock shares counts across concurrent cPanel PHP workers; HMAC keys avoid storing raw IP addresses. If account-home storage is unavailable, the limiter logs the issue and fails open so the forms remain available.

This reduces bursts but is not CAPTCHA or bot verification; distributed clients can still submit. Live form submission and email delivery were not tested to avoid sending real email.

### 2. Node rate limits are per function process

`api/_security.js` keeps rate-limit state in memory. This can slow repeated requests handled by one warm Vercel instance, but separate instances and cold starts do not share the counter. It is best-effort protection, not a global login/contact quota.

The Vercel limit remains best-effort for Node endpoints; the cPanel PHP form limit is a separate shared file-backed control.

### 3. cPanel deployment now separates PHP handlers from Node functions

The GitHub workflow and `scripts/deploy_cpanel.sh` now sync `public/api/` to `public_html/api/`, remove stale Node `.js` handlers from that directory, and exclude `api/` from the static-root sync. Vercel continues to deploy the repository's Node handlers. SSH inspection confirmed the document root and the live `.htaccess` rewrite for `/api/contact`.

The PHP endpoints deploy separately from Node functions; cPanel does not need to run Node.js.

### 4. Schema initialization is on request paths

Several handlers call `ensureTables()` during requests. That repeats schema checks against Neon and adds database work to function invocations. Public GET CDN caching reduces repeat calls for the cacheable endpoints, but it does not replace a migration/bootstrap process.

Recommended next step: plan a safe one-time migration/bootstrap path before removing request-time initialization. No Neon schema migration was made in this review.

### 5. Development dependency audit is not clean

`npm audit --omit=dev` reported zero production dependency vulnerabilities after the Nodemailer update. The full audit still reports seven development-toolchain vulnerabilities, including the locked Vite 8.0.10 and transitive build dependencies. `npm audit fix` resolved the advisories in the lockfile but moved Vite/Rolldown to a combination where a clean `npm ci` did not install Rolldown's Linux native optional binding, and `npm run build` then failed. The lockfile was restored to the last-known-good build state rather than leaving a lockfile that fails to build.

Recommended next step: resolve the Rolldown optional native package installation in CI, then update the dev toolchain and require a clean-install build before accepting the lockfile.

### 6. The existing lint command reports repository-wide failures

The last `npm run lint` run reported 61 errors and one warning across 69 files, including existing violations in files outside this review. The GitHub cPanel workflow does not run lint, but this is not a clean lint baseline. The package has no test script.

## Dependency/runtime notes

Nodemailer is updated to 10.0.12, and `package.json` pins the Node engine to `22.x`. Nodemailer 10 requires Node 20 or newer; Node 22 is used by the GitHub build workflow and is available on Vercel. This does not install Node on cPanel; cPanel continues to receive static files and PHP handlers.

## Certificate v2 merge review

The reviewed remote branch is `origin/feature/certificate-system-v2` at `1c9eb1c`, one commit ahead of the local `feature/certificate-system-v2` ref. A merge-tree check against `main` found no textual conflicts. The unique remote commit changes the Academy/Skilled Institute presentation and adds client-side SEO metadata; it does not add database/API schema changes.

Items reviewed on the remote branch:

1. The Grades 5–8 canonical URL now matches the actual `/academy/grades-5-8` route.
2. The SEO component restores prior title/meta/canonical/schema values when a route unmounts, preventing stale route metadata in later SPA navigation. Route-specific metadata is still added client-side; crawlers that do not execute the SPA see only the shared metadata in `index.html`.
3. `.cert-header-tagline` opacity is set to `1` so the label remains legible.
4. Trailing whitespace from the v2 diff was removed in the merge candidate.

The raw v2 branch build completed but emitted a large certificate-template chunk warning. The merge candidate keeps main's removed PDF-download code; its build completed with a 22.67 KB certificate-template chunk.

## Verification performed in this review

- `npm ci` and `npm run build` passed with the retained lockfile on Node 22, including the v2 merge candidate.
- `npm audit --omit=dev` reported zero vulnerabilities.
- Node syntax checks passed for the changed API/server/seed files; PHP syntax checks passed for both form endpoints.
- `git diff --check` passed for this worktree.
- No Neon schema change was made.
