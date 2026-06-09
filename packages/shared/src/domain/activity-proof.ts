export const VISIT_STAMP_PROOF_STATUSES = [
  "DRAFT",
  "EARNED",
  "VERIFIED",
  "REVOKED",
  "EXPIRED",
  "ARCHIVED"
] as const;

export type VisitStampProofStatus = (typeof VISIT_STAMP_PROOF_STATUSES)[number];

export const VISIT_STAMP_SOURCE_TYPES = [
  "SITE_ACCESS_SCAN",
  "BOOKING_COMPLETION",
  "STAFF_VALIDATION",
  "MANUAL_GOVERNANCE_REVIEW",
  "SYSTEM_EVENT",
  "PARTNER_EVENT"
] as const;

export type VisitStampSourceType = (typeof VISIT_STAMP_SOURCE_TYPES)[number];

export const ACTIVITY_PROOF_STATUSES = [
  "DRAFT",
  "RECORDED",
  "VERIFIED",
  "REJECTED",
  "REVOKED",
  "ARCHIVED"
] as const;

export type ActivityProofStatus = (typeof ACTIVITY_PROOF_STATUSES)[number];

export const ACTIVITY_PROOF_TYPES = [
  "SITE_ACCESS_SCAN",
  "VISIT_STAMP",
  "BOOKING_ATTENDANCE",
  "TRAIL_PROGRESS",
  "STAFF_VALIDATION",
  "GOVERNANCE_REVIEW"
] as const;

export type ActivityProofType = (typeof ACTIVITY_PROOF_TYPES)[number];

export const ACTIVITY_PROOF_EVIDENCE_TYPES = [
  "QR_SCAN",
  "STAFF_CONFIRMATION",
  "SYSTEM_EVENT",
  "PHOTO_REFERENCE",
  "DOCUMENT_REFERENCE",
  "EXTERNAL_REFERENCE"
] as const;

export type ActivityProofEvidenceType = (typeof ACTIVITY_PROOF_EVIDENCE_TYPES)[number];

export interface VisitStampProofRecord {
  id: string;
  stampStatus: VisitStampProofStatus;
  sourceType: VisitStampSourceType;
  proofRecordedAt?: string | Date | null;
  proofVerifiedAt?: string | Date | null;
  proofRevokedAt?: string | Date | null;
  proofReferenceHash?: string | null;
}

export interface ActivityProofRecord {
  id: string;
  proofCode: string;
  travelerId?: string | null;
  passId?: string | null;
  siteAccessPointId?: string | null;
  scanEventId?: string | null;
  visitStampId?: string | null;
  bookingId?: string | null;
  proofType: ActivityProofType;
  status: ActivityProofStatus;
  occurredAt?: string | Date | null;
  verifiedAt?: string | Date | null;
  verifiedByUserId?: string | null;
  sourceReferenceHash?: string | null;
}

export interface ActivityProofEvidenceRecord {
  id: string;
  proofRecordId: string;
  evidenceCode: string;
  evidenceType: ActivityProofEvidenceType;
  status: ActivityProofStatus;
  evidenceReferenceHash?: string | null;
  capturedAt?: string | Date | null;
  verifiedAt?: string | Date | null;
  verifiedByUserId?: string | null;
}

export const VISIT_STAMP_ACTIVITY_PROOF_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsProofTruth: false,
  standaloneDinagatPass: true,
  officialTravelerQrRemainsIdentity: true,
  siteAccessQrIsLocationActionContext: true,
  scanEventRecordsActualAction: true,
  visitStampRequiresBackendProof: true,
  activityProofRequiresBackendEvent: true,
  noFrontendAwardedStampsAllowed: true,
  noFakeVisitStampSuccessAllowed: true,
  noFakeActivityProofAllowed: true,
  usesProofSpecificVisitStampStatus: true
} as const;
