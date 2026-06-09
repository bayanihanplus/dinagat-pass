# 08 DOMAIN CONTRACTS DECISION

Lane:

DINAGAT-PASS-DOMAIN-CONTRACTS-01  
Shared Domain Contracts + State Enums Before Schema

## Purpose

Lock shared domain language before database schema, backend implementation, frontend UI, auth, QR logic, payment logic, and marketplace exposure logic are created.

This prevents schema/backend/frontend drift.

## Core doctrine preserved

Dinagat Pass is standalone.

One Siargao Pass is architectural reference only. - reference-only anti-drift boundary; not a parent app, not shared runtime, and not a source of Dinagat Pass authority.

QR / Scan Event is operational truth.

Visit Stamp is derived output.

Booking is request / commercial lifecycle.

Payment Readiness is backend-controlled.

Operator Capability is fulfillment authority.

Site Access Point is location/action context.

Source Attribution is economic accountability.

Marketplace Exposure is governed public visibility.

Audit Event is governance accountability.

## Contracts added

Shared domain contracts were added under:

packages/shared/src/domain

Files:

- constants.ts
- enums.ts
- state-guards.ts
- index.ts

Root shared export:

packages/shared/src/index.ts

## Experience families locked

1. BLUE_LAGOON_PANGABANGAN
2. LAKE_BABABU_BASILISA_GEOSITE
3. DINAGAT_ISLAND_HOPPING
4. LORETO_BONSAI_FOREST_ECO
5. SAN_JOSE_MYSTICAL_CULTURE
6. COMMUNITY_FOOD_LOCAL_COMMERCE
7. ADVENTURE_CAVE_LAGOON_ECO
8. RETURN_VISITOR_CONTINUITY

No random ninth family without doctrine amendment.

## Product categories locked

- DINAGAT_PARTNER_TOUR
- DINAGAT_CURATED_EXPERIENCE_TRAIL
- BUILD_YOUR_OWN_DINAGAT_TRAIL

Build Your Own Dinagat Trail is not a bypass tool.

It cannot fake operator-required, guide-required, site-controlled, or QR-validated completion.

## State model direction

Booking state, payment readiness, QR status, scan event status, visit stamp status, operator approval, operator capability, marketplace exposure, site access point status, source attribution, and audit action types are now centralized in the shared package.

Future Prisma schema must reuse this vocabulary.

Future backend modules must enforce these states.

Future frontend UI must display these states without inventing parallel terms.

## Hard implementation rules

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

DINAGAT-PASS-DATABASE-SCHEMA-01  
Prisma Schema Foundation + Database Contract Based on Shared Domain States

Important:

Do not implement visible product UI before design-system primitives.

Do not implement payment UX before backend payment readiness.

Do not implement visit stamp UX before QR / Scan Event truth.
