# 09 DATABASE SCHEMA FOUNDATION

Lane:

DINAGAT-PASS-DATABASE-SCHEMA-01  
Prisma Schema Foundation + Database Contract Based on Shared Domain States

## Purpose

Create the initial Prisma schema foundation for Dinagat Pass without running migrations or touching a real database.

This lane translates the shared domain state vocabulary into database-level enums and model boundaries.

## Database decision

Approved database:

PostgreSQL

Approved ORM:

Prisma ORM pinned to 6.19.0 for this scaffold lane.

Reason:

Prisma 7 introduced major setup/config changes. For this foundation lane, the project uses the stable Prisma 6 classic schema setup so the repository can validate and generate reliably on Windows before deeper implementation.

## What this lane adds

- apps/backend/prisma/schema.prisma
- Prisma dependencies in apps/backend/package.json
- backend db:validate script
- backend db:generate script
- PostgreSQL DATABASE_URL placeholder in .env.example

## What this lane does not do

- no migration
- no db push
- no seed
- no real PostgreSQL container
- no backend service implementation
- no auth implementation
- no QR validation logic
- no booking logic
- no payment logic
- no marketplace ranking logic
- no UI

## Doctrine preserved

QR / Scan Event is operational truth.

Visit Stamp is derived output.

Booking is request / commercial lifecycle.

Payment Readiness is backend-controlled.

Operator Capability is fulfillment authority.

Site Access Point is location/action context.

Source Attribution is economic accountability.

Marketplace Exposure is governed public visibility.

Audit Event is governance accountability.

## Schema boundaries created

The foundation schema includes:

- User
- TravelerProfile
- TravelerPass
- Operator
- OperatorCapability
- ExperienceProduct
- Booking
- SiteAccessPoint
- ProductSiteAccessPoint
- ScanEvent
- VisitStamp
- MarketplaceExposure
- SourceAttribution
- AuditEvent

## Hard interpretation

Request is not confirmation.

Accepted is not confirmed.

Paid is not completed.

Stamp is not source truth.

Exposure score is not approval.

Operator approval is not capability approval.

Discovery is not permission.

Visibility is not bookability.

Bookability is not payment readiness.

QR validation is operating truth.

## Next recommended lane

DINAGAT-PASS-BACKEND-FOUNDATION-01  
NestJS Prisma Module + Health Contract + Config Validation

Important:

Do not run migrations until local PostgreSQL/Docker database lane is explicitly approved.

Do not implement product UI before design-system primitives.

Do not implement payment UX before backend payment readiness exists.

Do not implement visit stamp UX before QR / Scan Event truth exists.