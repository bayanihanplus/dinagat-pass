# 03 DESIGN SYSTEM BOOTSTRAP

No Dinagat Pass interface may be built without design tokens and global primitives.

## Token doctrine

All UI must use controlled tokens for:

- color
- border radius
- spacing
- typography
- elevation
- focus states
- hover states
- active states
- disabled states
- status states

## Approved palette

- Deep Island Navy
- Ocean Teal
- Sun Gold
- White
- Soft Aqua Mist
- Soft Slate

No random colors are allowed.

No dominant green is allowed.

No heavy black sections are allowed.

## Required primitive direction

Future frontend must define controlled variants for:

- Button
- Card
- Badge
- AppShell
- MobileBottomNav
- OfficialPassCard
- ExperienceCompactCard
- BookingStatusCard
- OperatorRequestCard
- ScanOutcomeCard
- PaymentReadinessCard
- AdvisoryBanner
- ComplianceExceptionCard
- ApprovalDecisionPanel
- MarketplaceReadinessCard

## Button standards

Buttons must be direct, compact, high-trust, and status-aware.

No weak gray primary CTAs.

No payment CTA may appear before backend-controlled payment readiness.

No stamp CTA may appear before QR / Scan Event truth.

## Card standards

Cards must be compact, intuitive, and governed by clear border radius and spacing.

No card dump.

No long-copy traveler cards.

No generic marketplace tiles without readiness, source, or governance logic.

## Badge standards

Badges must communicate verified status, readiness, request state, QR state, compliance state, or operator capability.

No decorative badges without operational meaning.
