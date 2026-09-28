# Stellar Institute — Security and Deployment Review

Review date: 2026-09-29
Scope: repository source, dependency lockfile, GitHub deployment workflow, and the requested review of `origin/feature/certificate-system-v2`.
Limit: static review only. The Vercel project settings, production environment variables, Neon data, cPanel configuration, and live traffic were not inspected.

## Hosting model

- The frontend is a React/Vite single-page app. The cPanel host serves the built static files and PHP contact/admission handlers.
- Vercel runs the `api/*.js` handlers as Node.js functions. The handlers do not opt into Vercel's Edge Runtime.
- Neon Postgres is the database used by the Vercel handlers. Keep `VITE_API_URL` pointed at the Vercel API for database-backed pages; setting it to cPanel `/api` would direct those calls to a host that cannot run the Node handlers.
- The GitHub workflow builds with Node 22 and deploys to cPanel when `main` changes. The Vercel project is also connected to GitHub, so a merge to `main` may deploy there too.

## Current controls verified in source

- `JWT_SECRET` has no hardcoded fallback. Admin login fails if it is not configured.
- `admin-seed` requires an existing admin JWT; it no longer accepts a static provisioning secret.
- `.env`, `.env.*`, and production environment files are ignored by Git.
- API and Vercel responses set security headers. Admin responses use `Cache-Control: private, no-store`.
- The public image endpoint returns only its public image fields. Admin mutations still require a JWT.
- Neon queries reviewed here use parameterized tagged-template queries.
- PHP mail failures no longer return PHP's internal error details to the caller.
- Admin default-password configuration seeds an admin only when no `admin` record exists; it no longer resets that account's password on each table initialization.
- Public certificate lookup intentionally returns the student's full CNIC. This is an explicit product requirement from the site owner. The endpoint remains public by registration number and is marked `private, no-store` to avoid intermediary/browser caching; this does not mask or restrict the CNIC.

## Findings to address

### 1. PHP form endpoints have no server-side abuse limit

`public/api/contact.php` and `public/api/admission.php` accept cross-origin POSTs and call PHP `mail()`. They validate required fields and email syntax, but do not enforce a request rate limit or CAPTCHA/honeypot. The Node rate limiter does not cover these PHP routes, which are the routes the live forms call. Wildcard CORS does not stop direct HTTP submissions.

Recommended next step: add a hosting-compatible server-side limiter or bot check to the PHP endpoints, then verify the live forms and mail delivery before deploying. Do not assume the in-memory Node limiter protects these forms.

### 2. Node rate limits are per function process

`api/_security.js` keeps rate-limit state in memory. This can slow repeated requests handled by one warm Vercel instance, but separate instances and cold starts do not share the counter. It is best-effort protection, not a global login/contact quota.

Recommended next step: use a shared rate-limit store or platform-level protection if a reliable global limit is required. Keep the cPanel PHP routes covered separately.

### 3. cPanel deployment copies Node source into the public site tree

The GitHub workflow and `scripts/deploy_cpanel.sh` copy `api/` into `public_html/api/`, although shared cPanel does not execute Node. The live PHP form handlers are separate `.php` files. Whether `.js` files can be downloaded as source depends on the Apache configuration; this review did not inspect that configuration.

Recommended next step: remove the unnecessary source sync in a separately reviewed deployment change and check the existing `public_html/api/` contents before deleting anything. This review did not change the workflow or deployment script.

### 4. Schema initialization is on request paths

Several handlers call `ensureTables()` during requests. That repeats schema checks against Neon and adds database work to function invocations. Public GET CDN caching reduces repeat calls for the cacheable endpoints, but it does not replace a migration/bootstrap process.

Recommended next step: plan a safe one-time migration/bootstrap path before removing request-time initialization. No Neon schema migration was made in this review.

### 5. Development dependency audit is not clean

`npm audit --omit=dev` reported zero production dependency vulnerabilities after the Nodemailer update. The full audit still reports seven development-toolchain vulnerabilities, including the locked Vite 8.0.10 and transitive build dependencies. `npm audit fix` resolved the advisories in the lockfile but moved Vite/Rolldown to a combination where a clean `npm ci` did not install Rolldown's Linux native optional binding, and `npm run build` then failed. The lockfile was restored to the last-known-good build state rather than leaving a lockfile that fails to build.

Recommended next step: resolve the Rolldown optional native package installation in CI, then update the dev toolchain and require a clean-install build before accepting the lockfile.

### 6. The existing lint command reports repository-wide failures

The last `npm run lint` run reported 61 errors and one warning across 69 files, including existing violations in files outside this review. The GitHub cPanel workflow does not run lint, but this is not a clean lint baseline. The package has no test script.

## Dependency/runtime change in this worktree

Nodemailer is updated to 10.0.12, and `package.json` pins the Node engine to `22.x`. Nodemailer 10 requires Node 20 or newer; Node 22 is already used by the GitHub build workflow and is available on Vercel. This does not install Node on cPanel; cPanel continues to receive static files and PHP handlers. The change is local and has not been deployed.

## Certificate v2 merge review

The reviewed remote branch is `origin/feature/certificate-system-v2` at `1c9eb1c`, one commit ahead of the local `feature/certificate-system-v2` ref. A merge-tree check against `main` found no textual conflicts. The unique remote commit changes the Academy/Skilled Institute presentation and adds client-side SEO metadata; it does not add database/API schema changes.

Review items before merging:

1. The Grades 5–8 route is `/academy/grades-5-8`, while that page declares the canonical `/academy/grades-5-to-8`.
2. Route metadata is written in `useEffect`, so static HTML and crawlers that do not execute the SPA do not receive route-specific tags. Routes without the SEO component can also retain metadata from a prior route.
3. `.cert-header-tagline` has `opacity: 0.1`, making the tagline nearly invisible.
4. `git diff --check main...origin/feature/certificate-system-v2` reports trailing whitespace in `index.html`, `SEO.jsx`, `Academy.jsx`, and `SkilledInstitute.jsx`.

The raw v2 branch build completed but emitted a large certificate-template chunk warning. The current `main` build after its PDF-download removal completes without that large chunk; run a build on the actual merge candidate before merging to confirm the merged result.

## Verification performed in this review

- `npm ci` and `npm run build` passed with the retained lockfile on Node 22.
- `npm audit --omit=dev` reported zero vulnerabilities.
- Node syntax checks passed for the changed API/server/seed files; PHP syntax checks passed for both form endpoints.
- `git diff --check` passed for this worktree.
- No merge, push, deployment, or Neon schema change was performed.
