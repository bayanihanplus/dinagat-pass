# DINAGAT PASS — MVP BACKEND BUILD SEQUENCE

Status: active build sequence after first clean baseline.

## Non-negotiable build doctrine

Dinagat Pass is a standalone app, standalone repository, standalone database, and standalone backend authority layer.

One Siargao Pass / OSP may be used only as architectural-reference-only thinking. It is not a parent app, not shared runtime, not shared database, not shared frontend, and not a source of Dinagat Pass authority.

The backend owns authority. The frontend must not own permission, approval, commercial readiness, QR validation, audit truth, registry truth, or governance state.

Every privileged backend workflow must be auditable.

No generic build. No flat placeholder system. No fake production claims.

## Already completed foundation

The following foundation is already established and must be preserved:

1. Standalone monorepo baseline.
2. Docker Postgres on port 55432.
3. Prisma schema and migrations.
4. Seeded SUPER_ADMIN foundation user.
5. Auth credential foundation.
6. Auth session hardening with hashed session tokens.
7. Backend auth context resolution.
8. Role and capability guards.
9. Governance audit guardrail module.
10. Local verification harness.
11. Runtime anti-drift guardrails.
12. Clean local Git baseline and cleanup commits.

## MVP backend build order

### Lane 01 — Core Registry Foundation

Purpose: define canonical backend registries without traveler UI or commercial UI.

Backend scope:
- Municipality registry.
- Barangay registry.
- Destination / site registry.
- Site type taxonomy.
- Site operational status.
- Governance ownership metadata.
- Audit events for registry create/update/status changes.

Hard rule:
Registry truth belongs to backend and database, not frontend constants.

### Lane 02 — Local Operator / Provider Registry

Purpose: create the governed supply-side registry.

Backend scope:
- Operator / provider profile.
- Accreditation or verification status.
- Service capability categories.
- Contact and business readiness metadata.
- Suspension / active status.
- Audit events for approval, rejection, suspension, and profile updates.

Hard rule:
Do not expose all operators in a flat marketplace list. Marketplace exposure requires readiness and governance gates.

### Lane 03 — Site Access Point Foundation

Purpose: create canonical scan/access/check-in/payment/stamp locations.

Backend scope:
- Site access point.
- QR definition for access point context.
- Scan event model.
- Access point status.
- Fee-rule placeholder structure where applicable.
- Audit trail for access point configuration.

Hard rule:
Traveler identity QR and site/action QR context must remain separated.

### Lane 04 — Traveler Pass Identity Foundation

Purpose: create the first backend-owned traveler pass identity primitives.

Backend scope:
- Traveler profile shell.
- Pass identity record.
- Pass status.
- QR token definition owned by backend.
- Pass lookup / validation service.
- Audit trail for pass issue, revoke, validate.

Hard rule:
QR validation truth must be backend-owned and logged.

### Lane 05 — Visit / Stamp / Activity Proof Foundation

Purpose: create proof-of-visit backend truth.

Backend scope:
- Visit stamp model.
- Stamp issuing method.
- Scan-to-stamp linkage.
- Manual governance override with reason.
- Audit event for issue, revoke, correction.

Hard rule:
No frontend-only stamp proof.

### Lane 06 — Booking / Request Foundation

Purpose: create early transaction/request backend foundation without overbuilding payments.

Backend scope:
- Booking/request shell.
- Booking status taxonomy.
- Request source.
- Operator/service linkage where applicable.
- Governance-readable state history.
- Audit event for status changes.

Hard rule:
Commercial readiness must be separate from public exposure.

### Lane 07 — Admin / Governance API Surface

Purpose: expose controlled backend APIs for future staff/admin surfaces.

Backend scope:
- Protected controller routes.
- Capability-based access.
- Governance audit requirement for privileged actions.
- Reason-required privileged mutation.
- Read-only readiness endpoints.

Hard rule:
Do not build broad admin UI before backend authority exists.

### Lane 08 — Verification Harness Expansion

Purpose: expand local verification scripts for each MVP backend domain.

Backend scope:
- Doctrine-safe counts update.
- Registry verification.
- Operator registry verification.
- Site access verification.
- Traveler pass verification.
- Scan/stamp verification.
- Booking/request verification.

Hard rule:
Every backend build lane must leave the repo verifiable from scripts.

## Immediate next technical lane

Next executable backend lane:

DINAGAT-PASS-MVP-REGISTRY-SCHEMA-FOUNDATION-01

Goal:
Add the first MVP registry schema foundation to Prisma and shared domain contracts.

Expected output:
- New Prisma models/enums for municipality, barangay, destination/site registry, and registry audit-safe status fields.
- Additive migration only.
- No destructive reset.
- No frontend redesign.
- Verification script proving zero unsafe seed/product data inflation.
- Typecheck/build pass.
- No commit until audit and approval.

## Build guardrails for all succeeding lanes

1. Use `pnpm exec prisma`, never `npx prisma`.
2. Keep DATABASE_URL on 127.0.0.1:55432.
3. Stop Node processes before local verification.
4. Do not use port 5432.
5. Do not stage or commit without explicit approval.
6. Do not push unless explicitly requested.
7. Do not mix frontend redesign into backend schema lanes.
8. Do not introduce OSP runtime references.
9. Do not create fake marketplace exposure.
10. Do not create fake traveler QR success.
