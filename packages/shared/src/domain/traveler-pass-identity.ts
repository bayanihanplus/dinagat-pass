export const TRAVELER_PASS_IDENTITY_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "REVOKED",
  "ARCHIVED"
] as const;

export type TravelerPassIdentityStatus = (typeof TRAVELER_PASS_IDENTITY_STATUSES)[number];

export const TRAVELER_PASS_QR_CREDENTIAL_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "ROTATED",
  "REVOKED",
  "EXPIRED",
  "ARCHIVED"
] as const;

export type TravelerPassQrCredentialStatus = (typeof TRAVELER_PASS_QR_CREDENTIAL_STATUSES)[number];

export const TRAVELER_PASS_QR_CREDENTIAL_PURPOSES = [
  "TRAVELER_IDENTITY",
  "SITE_ACCESS_SCAN",
  "BOOKING_CONTEXT",
  "STAFF_VALIDATION",
  "GOVERNANCE_AUDIT"
] as const;

export type TravelerPassQrCredentialPurpose = (typeof TRAVELER_PASS_QR_CREDENTIAL_PURPOSES)[number];

export const TRAVELER_IDENTITY_CLAIM_TYPES = [
  "EMAIL",
  "PHONE",
  "NAME_REFERENCE",
  "DOCUMENT_REFERENCE",
  "MANUAL_GOVERNANCE_REFERENCE",
  "EXTERNAL_REFERENCE"
] as const;

export type TravelerIdentityClaimType = (typeof TRAVELER_IDENTITY_CLAIM_TYPES)[number];

export const TRAVELER_IDENTITY_CLAIM_STATUSES = [
  "DRAFT",
  "CLAIMED",
  "VERIFIED",
  "REJECTED",
  "REVOKED",
  "ARCHIVED"
] as const;

export type TravelerIdentityClaimStatus = (typeof TRAVELER_IDENTITY_CLAIM_STATUSES)[number];

export interface TravelerPassIdentityRecord {
  id: string;
  travelerId: string;
  identityStatus: TravelerPassIdentityStatus;
  identityPublicCode?: string | null;
  identityIssuedAt?: string | Date | null;
  identityRevokedAt?: string | Date | null;
}

export interface TravelerPassQrCredentialRecord {
  id: string;
  passId: string;
  credentialCode: string;
  status: TravelerPassQrCredentialStatus;
  purpose: TravelerPassQrCredentialPurpose;
  issuedAt?: string | Date | null;
  expiresAt?: string | Date | null;
  revokedAt?: string | Date | null;
  rotationReason?: string | null;
}

export interface TravelerIdentityClaimRecord {
  id: string;
  travelerId: string;
  passId?: string | null;
  claimType: TravelerIdentityClaimType;
  status: TravelerIdentityClaimStatus;
  verifiedAt?: string | Date | null;
  verifiedByUserId?: string | null;
  revokedAt?: string | Date | null;
}

export const TRAVELER_PASS_IDENTITY_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsIdentityTruth: false,
  standaloneDinagatPass: true,
  officialTravelerQrRemainsIdentity: true,
  qrTokenHashOnly: true,
  rawQrTokenStorageAllowed: false,
  siteAccessQrDoesNotReplaceTravelerQr: true,
  scanEventWillRecordActualAction: true,
  noFakeTravelerQrSuccessAllowed: true
} as const;
