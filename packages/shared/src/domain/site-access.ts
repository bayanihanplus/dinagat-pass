export const SITE_ACCESS_POINT_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "SUSPENDED",
  "ARCHIVED"
] as const;

export type SiteAccessPointStatus = (typeof SITE_ACCESS_POINT_STATUSES)[number];

export const SITE_ACCESS_POINT_TYPES = [
  "LGU_SITE",
  "TOURISM_SITE",
  "PORT_TERMINAL",
  "BARANGAY_ACCESS_POINT",
  "ACCOMMODATION_CHECK_IN",
  "OPERATOR_CHECK_IN",
  "MERCHANT_CHECK_IN",
  "TRANSPORT_CHECK_IN",
  "TRAIL_STOP",
  "EVENT_GATE",
  "OTHER"
] as const;

export type SiteAccessPointType = (typeof SITE_ACCESS_POINT_TYPES)[number];

export const SITE_ACCESS_OWNER_TYPES = [
  "LGU",
  "PROVINCIAL_TOURISM",
  "DOT",
  "BARANGAY",
  "COMMUNITY",
  "PRIVATE_PARTNER",
  "LOCAL_OPERATOR",
  "ACCOMMODATION",
  "MERCHANT",
  "MIXED"
] as const;

export type SiteAccessOwnerType = (typeof SITE_ACCESS_OWNER_TYPES)[number];

export const SITE_ACCESS_QR_PURPOSES = [
  "SITE_CONTEXT",
  "ACCESS_CHECK_IN",
  "PAYMENT_CONTEXT",
  "STAMP_VALIDATION",
  "ARRIVAL_LOG",
  "OPERATOR_SERVICE_CHECK_IN",
  "ACCOMMODATION_CHECK_IN",
  "MERCHANT_CHECK_IN",
  "EVENT_ENTRY"
] as const;

export type SiteAccessQrPurpose = (typeof SITE_ACCESS_QR_PURPOSES)[number];

export const SITE_ACCESS_FEE_RULE_TYPES = [
  "NONE",
  "STANDARD",
  "RESIDENT_RATE",
  "DISCOUNTED",
  "EXEMPT",
  "SENIOR_RATE",
  "CHILD_RATE",
  "CUSTOM"
] as const;

export type SiteAccessFeeRuleType = (typeof SITE_ACCESS_FEE_RULE_TYPES)[number];

export const SITE_ACCESS_FEE_COLLECTION_MODES = [
  "NOT_COLLECTED",
  "CASH_ON_SITE",
  "ONLINE_PREPAY",
  "COUNTER_PAYMENT",
  "PARTNER_COLLECTED",
  "GOVERNMENT_COLLECTED",
  "MIXED"
] as const;

export type SiteAccessFeeCollectionMode = (typeof SITE_ACCESS_FEE_COLLECTION_MODES)[number];

export const SITE_ACCESS_ELIGIBILITY_TYPES = [
  "PUBLIC",
  "RESIDENT",
  "NON_RESIDENT",
  "SENIOR",
  "CHILD",
  "STUDENT",
  "PWD",
  "LGU_STAFF",
  "OPERATOR_STAFF",
  "APPROVED_PARTNER",
  "CUSTOM"
] as const;

export type SiteAccessEligibilityType = (typeof SITE_ACCESS_ELIGIBILITY_TYPES)[number];

export interface SiteAccessPointRecord {
  id: string;
  publicCode: string;
  name: string;
  status: SiteAccessPointStatus;
  locationLabel?: string | null;
  actionContext: string;
  pointType: SiteAccessPointType;
  ownerType: SiteAccessOwnerType;
  ownerName?: string | null;
  municipalityId?: string | null;
  barangayId?: string | null;
  destinationSiteId?: string | null;
  operatorRegistryId?: string | null;
  publicSummary?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export interface SiteAccessQrDefinitionRecord {
  id: string;
  siteAccessPointId: string;
  purpose: SiteAccessQrPurpose;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
  label: string;
  qrSlug: string;
  description?: string | null;
  validFrom?: string | Date | null;
  validUntil?: string | Date | null;
}

export interface SiteAccessFeeRuleRecord {
  id: string;
  siteAccessPointId: string;
  ruleType: SiteAccessFeeRuleType;
  eligibilityType: SiteAccessEligibilityType;
  collectionMode: SiteAccessFeeCollectionMode;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
  label: string;
  amount?: string | number | null;
  currency: string;
  requiresVerification: boolean;
  notes?: string | null;
}

export const SITE_ACCESS_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsAccessTruth: false,
  standaloneDinagatPass: true,
  extendsExistingSiteAccessPoint: true,
  officialTravelerQrRemainsIdentity: true,
  siteAccessQrIsLocationActionContext: true,
  scanEventWillRecordActualAction: true,
  feeRulesRequireGovernanceConfiguration: true,
  noFakeAccessSuccessAllowed: true
} as const;
