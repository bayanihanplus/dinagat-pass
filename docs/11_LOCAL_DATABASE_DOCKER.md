# 11 LOCAL DATABASE DOCKER

Lane:

DINAGAT-PASS-LOCAL-DATABASE-DOCKER-01
Local PostgreSQL Docker Compose + First Migration Readiness

## Purpose

Create the local PostgreSQL database environment for Dinagat Pass and prove that the Prisma schema can migrate against a real local database.

## Added

- docker-compose.yml
- local PostgreSQL service
- local .env DATABASE_URL
- backend database scripts:
  - db:validate
  - db:generate
  - db:migrate
  - db:migrate:init
  - db:status
  - db:studio

## Local database

Service:

dinagat-pass-postgres

Container:

dinagat-pass-postgres

Database:

dinagat_pass

User:

dinagat_pass_user

Port:

5432

## Migration boundary

This lane may run the first local Prisma migration.

This lane does not seed data.

This lane does not implement backend product workflows.

This lane does not implement auth.

This lane does not implement QR validation.

This lane does not implement booking logic.

This lane does not implement payment readiness logic.

This lane does not implement marketplace exposure logic.

This lane does not implement product UI.

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

## Next recommended lane

DINAGAT-PASS-BACKEND-DB-READINESS-01
Backend Database Readiness Check + Prisma Connection Health

Important:

After this lane, backend health may safely add a database readiness check, but it must still avoid product workflows.