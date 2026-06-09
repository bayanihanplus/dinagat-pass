# 07 MONOREPO SCAFFOLD DECISION

Lane:

DINAGAT-PASS-MONOREPO-SCAFFOLD-01  
Install Workspace Tooling + Frontend/Backend Package Shells

## Purpose

Make the standalone Dinagat Pass repository technically executable while avoiding product implementation drift.

## Added

- pnpm workspace
- root TypeScript baseline
- root ESLint baseline
- Next.js web package shell
- NestJS + Fastify backend package shell
- shared TypeScript package shell
- neutral health endpoints
- no product UI
- no schema
- no auth
- no QR logic
- no booking logic
- no payment logic

## Confirmed doctrine

Dinagat Pass is standalone.

OSP is architectural reference only.

QR / Scan Event is operational truth.

Visit Stamp is derived output.

Booking is request / commercial lifecycle.

Payment Readiness is backend-controlled.

Operator Capability is fulfillment authority.

Site Access Point is location/action context.

Source Attribution is economic accountability.

Marketplace Exposure is governed public visibility.

Audit Event is governance accountability.

## Current app surfaces

Web:

- apps/web
- health endpoint: /api/health
- no traveler product UI

Backend:

- apps/backend
- health endpoint: /health
- no domain implementation

Shared:

- packages/shared
- doctrine constants only
- no schema contracts yet

## Next recommended lane

DINAGAT-PASS-DOMAIN-CONTRACTS-01  
Shared Domain Contracts + State Enums Before Schema

Reason:

Before database schema, lock shared domain contracts and state enums so schema/backend/frontend do not drift.
