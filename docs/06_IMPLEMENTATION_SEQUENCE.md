# 06 IMPLEMENTATION SEQUENCE

This file defines the next build order after the app stack decision.

## Current completed lanes

1. DINAGAT-PASS-STANDALONE-REPO-BOOTSTRAP-02
   Standalone repo shell + doctrine/design-system foundation

2. DINAGAT-PASS-APP-STACK-DECISION-01
   Standalone app stack decision

## Next recommended lane

DINAGAT-PASS-MONOREPO-SCAFFOLD-01  
Install Workspace Tooling + Frontend/Backend Package Shells

## Purpose of next lane

The next lane may install and configure the technical workspace, but must still avoid product-page buildout.

Allowed next-lane scope:

- pnpm workspace file
- root TypeScript config
- root lint/format baseline
- apps/web package shell
- apps/backend package shell
- packages/shared package shell
- basic health check route only if needed
- no product UI
- no schema yet
- no booking logic yet
- no QR logic yet
- no payment logic yet

## After that

Recommended sequence:

1. DINAGAT-PASS-MONOREPO-SCAFFOLD-01
2. DINAGAT-PASS-DOMAIN-CONTRACTS-01
3. DINAGAT-PASS-DATABASE-SCHEMA-01
4. DINAGAT-PASS-BACKEND-MVP-SPINE-01
5. DINAGAT-PASS-WEB-DESIGN-SYSTEM-FOUNDATION-01
6. DINAGAT-PASS-TRAVELER-MVP-FLOW-01

## Hard execution rule

Do not build visible traveler/operator/admin UI until design tokens and global primitives exist.

Do not build payment UX until backend payment readiness exists.

Do not build visit stamp UX until QR / Scan Event truth exists.

Do not expose operators publicly until operator capability and marketplace exposure rules exist.
