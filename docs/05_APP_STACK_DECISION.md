# 05 APP STACK DECISION

Lane:

DINAGAT-PASS-APP-STACK-DECISION-01  
Standalone App Stack Decision: Backend, Frontend, Database, Auth, Deployment

## Core ruling

Dinagat Pass remains a standalone app and standalone repository.

One Siargao Pass is architectural reference only. - reference-only anti-drift boundary; not a parent app, not shared runtime, and not a source of Dinagat Pass authority.

This decision does not scaffold frontend pages, backend modules, database schema, auth implementation, or deployment files.

## Approved monorepo strategy

Use a TypeScript-first monorepo with:

- apps/web
- apps/backend
- packages/shared
- docs
- infra
- scripts

Package manager:

- pnpm workspace

Reason:

pnpm workspaces are sufficient for a standalone MVP. Turborepo can be added later if build orchestration becomes necessary, but it is not required for the first implementation lane.

## Approved frontend stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- tokenized design system
- mobile-first responsive PWA direction

Frontend responsibility:

- traveler discovery
- official pass/QR presentation
- booking/request UX
- operator/admin/LGU surfaces later
- status display
- scan-result display
- payment-readiness display

Frontend must not own:

- QR truth
- scan truth
- payment readiness
- operator capability
- marketplace approval
- visit stamp authority
- audit truth

Hard rule:

The frontend displays backend truth. It must not fake operational states.

## Approved backend stack

Use:

- NestJS
- Fastify adapter
- TypeScript
- REST API first
- OpenAPI contract
- modular domain architecture

Backend responsibility:

- auth and role authority
- traveler identity
- official pass/QR issuance logic
- QR validation
- scan event creation
- booking/request lifecycle
- operator capability
- payment readiness
- site access point logic
- source attribution
- marketplace exposure
- audit events
- admin/LGU governance state

Hard rule:

The backend is the authority layer.

No payment CTA may appear before backend payment readiness.

No visit stamp may be issued before governed QR / Scan Event truth.

No marketplace visibility may be treated as capability approval.

## Approved database stack

Use:

- PostgreSQL
- Prisma ORM
- Prisma Migrate

Reason:

Dinagat Pass is relational and governance-heavy.

The database must support:

- travelers
- passes
- QR definitions
- QR validation events
- scan events
- visit stamps
- bookings
- booking state machines
- operators
- operator capabilities
- site access points
- marketplace exposure records
- payment readiness
- source attribution
- audit events
- LGU/admin visibility

Hard rule:

QR / Scan Event is operational truth.

Visit Stamp is derived output.

Audit Event is governance accountability.

## Approved auth strategy

Use backend-owned auth.

Initial auth direction:

- email/password or magic-link-capable account model
- secure password hashing if password auth is used
- HTTP-only session/JWT cookie strategy
- backend role guards
- backend capability guards
- backend audit logging for privileged actions

Roles must be modeled for:

- traveler
- operator owner
- operator staff
- LGU user
- admin
- super admin

Hard rule:

Auth is not only identity.

For Dinagat Pass, auth must also support operational authority.

Operator approval is not the same as operator capability.

LGU visibility is not the same as super-admin bypass.

## Approved deployment strategy

Use Dockerized VPS deployment first.

Initial deployment target:

- Docker
- Caddy or Nginx reverse proxy
- PostgreSQL service
- backend service
- web service
- environment-based secrets
- production health checks

Reason:

This gives the project practical control, predictable cost, and enough production discipline without forcing premature cloud complexity.

Cloud-native deployment can be reconsidered later after the MVP operating chain is proven.

## API decision

Use REST first.

Add OpenAPI documentation early.

Do not use GraphQL for MVP.

Reason:

REST is easier to debug, easier to test, easier for future mobile clients, easier for admin tools, and sufficient for the booking / QR / operator / governance lifecycle.

## Mobile decision

Build mobile-first responsive web/PWA first.

Do not build native iOS/Android first.

Reason:

The operating system must be proven before native app expansion.

MVP priority is not app-store presence.

MVP priority is operational proof:

Traveler discovers experience
-> request is created
-> operator can review
-> operator can accept or reject
-> backend determines readiness
-> payment readiness is controlled by backend state
-> booking attaches to pass/trip
-> QR validation can create scan event
-> visit stamp derives from governed validation
-> LGU/admin can inspect audit trail

## Explicit rejection list

Do not use:

- generic full-stack template without doctrine
- frontend-only auth authority
- frontend-only booking confirmation
- frontend-only QR validation
- frontend-only payment readiness
- fake scan success
- fake visit stamps
- GraphQL-first MVP
- microservices-first MVP
- native-app-first MVP
- random UI library without token discipline
- generic tourism marketplace architecture

## Final approved stack

Monorepo:
pnpm workspace

Frontend:
Next.js App Router + TypeScript + Tailwind CSS + tokenized design system

Backend:
NestJS + Fastify + TypeScript + REST + OpenAPI

Database:
PostgreSQL

ORM:
Prisma ORM + Prisma Migrate

Auth:
Backend-owned auth with secure session/JWT cookie strategy, role guards, capability guards, and audit logging

Deployment:
Dockerized VPS first

Mobile:
Mobile-first responsive PWA first, native app later only after operating-chain proof
