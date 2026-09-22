/**
 * Stellar Institute — Shared Security Utilities
 * Works on both Vercel (serverless) and cPanel (persistent Node.js)
 */

// ─── Rate Limiter (in-memory, per-process) ───────────────────────
// On cPanel with persistent Node: works perfectly across requests.
// On Vercel serverless: best-effort per-instance (still blocks rapid bursts).
const rateLimitStores = {};

export function rateLimit(key, { maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  if (!rateLimitStores[key]) rateLimitStores[key] = [];

  // Purge expired entries
  rateLimitStores[key] = rateLimitStores[key].filter(ts => now - ts < windowMs);

  if (rateLimitStores[key].length >= maxAttempts) {
    const oldestTs = rateLimitStores[key][0];
    const retryAfter = Math.ceil((windowMs - (now - oldestTs)) / 1000);
    return { limited: true, retryAfter };
  }

  rateLimitStores[key].push(now);
  return { limited: false };
}

// ─── CORS Helper ─────────────────────────────────────────────────
// Reads allowed origins from env var ALLOWED_ORIGINS (comma-separated).
// Falls back to '*' for public endpoints, or blocks for admin endpoints.
export function setCorsHeaders(res, req, { isPublic = false } = {}) {
  const allowedRaw = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedRaw
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const origin = req.headers.origin || req.headers.referer || '';

  if (allowedOrigins.length > 0) {
    // If we have a whitelist, check against it
    const matched = allowedOrigins.find(allowed => origin.includes(allowed));
    res.setHeader('Access-Control-Allow-Origin', matched || allowedOrigins[0]);
  } else if (isPublic) {
    // Public endpoints with no whitelist configured: allow all
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Admin endpoints with no whitelist: allow the requesting origin
    // (safe because we still require JWT auth)
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24h
}

// ─── Security Headers ───────────────────────────────────────────
// Adds standard security headers to every response.
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// ─── JWT Secret ──────────────────────────────────────────────────
// Returns the JWT secret or throws if not configured.
// NEVER falls back to a hardcoded value.
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'Set it in your Vercel dashboard or cPanel Node.js app environment.'
    );
  }
  return secret;
}

// ─── Email Validation ────────────────────────────────────────────
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 simplified — covers 99.9% of real emails
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

// ─── Client IP Extraction ────────────────────────────────────────
// Works on both Vercel (x-forwarded-for) and cPanel (direct connection)
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}
