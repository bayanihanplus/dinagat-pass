# Dinagat Pass Local Verification Harness

This directory contains local-only verification helpers for Dinagat Pass backend hardening.

Rules:
- Local development only.
- Do not expose these scripts through API routes.
- Do not use these scripts to create product workflow data.
- No fake operators, bookings, scan events, visit stamps, or marketplace exposure records.
- Keep DATABASE_URL pointed at the isolated local Docker Postgres on port 55432.
- Prisma must run from apps/backend.
- These helpers are for verification cleanup and doctrine-safe counts only.

Current helpers:
- cleanup-verification-sessions.mjs
  Revokes active local verification sessions for the seeded admin user.
- doctrine-safe-counts.mjs
  Verifies no fake product or operational records exist.
