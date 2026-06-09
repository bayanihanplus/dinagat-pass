export const LOCAL_OPERATOR_PROVIDER_TYPES = [
  "TOUR_OPERATOR",
  "TRANSPORT_PROVIDER",
  "ACCOMMODATION_PROVIDER",
  "FOOD_MERCHANT",
  "GUIDE",
  "COMMUNITY_ORGANIZATION",
  "LGU_OPERATED",
  "MIXED_PROVIDER"
] as const;

export type LocalOperatorProviderType = (typeof LOCAL_OPERATOR_PROVIDER_TYPES)[number];

export const LOCAL_OPERATOR_VERIFICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
  "ARCHIVED"
] as const;

export type LocalOperatorVerificationStatus = (typeof LOCAL_OPERATOR_VERIFICATION_STATUSES)[number];

export const LOCAL_OPERATOR_ACCREDITATION_STATUSES = [
  "NOT_PROVIDED",
  "PENDING_REVIEW",
  "DOT_ACCREDITED",
  "LGU_RECOGNIZED",
  "PROVISIONAL",
  "EXPIRED",
  "REJECTED"
] as const;

export type LocalOperatorAccreditationStatus = (typeof LOCAL_OPERATOR_ACCREDITATION_STATUSES)[number];

export const LOCAL_OPERATOR_CAPABILITY_CATEGORIES = [
  "ISLAND_HOPPING",
  "LAND_TOUR",
  "WATER_ACTIVITY",
  "CULTURE_COMMUNITY",
  "FOOD_WELLNESS",
  "TRANSPORT_SUPPORT",
  "ACCOMMODATION",
  "GUIDE_SERVICE",
  "SITE_ACCESS_SUPPORT",
  "CUSTOM_SERVICE"
] as const;

export type LocalOperatorCapabilityCategory = (typeof LOCAL_OPERATOR_CAPABILITY_CATEGORIES)[number];

export const LOCAL_OPERATOR_COMMERCIAL_READINESS_STATUSES = [
  "NOT_READY",
  "PROFILE_ONLY",
  "REQUEST_TO_CONFIRM",
  "PRICING_READY",
  "BOOKING_READY",
  "SUSPENDED"
] as const;

export type LocalOperatorCommercialReadinessStatus =
  (typeof LOCAL_OPERATOR_COMMERCIAL_READINESS_STATUSES)[number];

export const LOCAL_OPERATOR_EXPOSURE_STATUSES = [
  "HIDDEN",
  "ELIGIBLE_FOR_REVIEW",
  "APPROVED_FOR_EXPOSURE",
  "SUSPENDED",
  "BLOCKED"
] as const;

export type LocalOperatorExposureStatus = (typeof LOCAL_OPERATOR_EXPOSURE_STATUSES)[number];

export const LOCAL_OPERATOR_COMPLIANCE_SEVERITIES = [
  "INFO",
  "WARNING",
  "RESTRICTION",
  "SUSPENSION",
  "BLOCKER"
] as const;

export type LocalOperatorComplianceSeverity = (typeof LOCAL_OPERATOR_COMPLIANCE_SEVERITIES)[number];

export interface LocalOperatorRegistryRecord {
  id: string;
  registryCode: string;
  displayName: string;
  legalName?: string | null;
  providerType: LocalOperatorProviderType;
  verificationStatus: LocalOperatorVerificationStatus;
  accreditationStatus: LocalOperatorAccreditationStatus;
  commercialReadinessStatus: LocalOperatorCommercialReadinessStatus;
  exposureStatus: LocalOperatorExposureStatus;
  primaryMunicipalityCode?: string | null;
  primaryBarangayCode?: string | null;
  contactPersonName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  publicSummary?: string | null;
}

export interface LocalOperatorCapabilityRecord {
  id: string;
  operatorRegistryId: string;
  category: LocalOperatorCapabilityCategory;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
  title?: string | null;
  description?: string | null;
  readinessNotes?: string | null;
}

export interface LocalOperatorComplianceRecord {
  id: string;
  operatorRegistryId: string;
  severity: LocalOperatorComplianceSeverity;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
  title: string;
  details?: string | null;
  reason?: string | null;
  resolvedAt?: string | Date | null;
}

export const OPERATOR_REGISTRY_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsOperatorTruth: false,
  standaloneDinagatPass: true,
  flatMarketplaceExposureAllowed: false,
  exposureRequiresGovernanceGates: true,
  operatorIdentityFromAuthContextOnly: true
} as const;
