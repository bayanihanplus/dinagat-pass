export const REGISTRY_RECORD_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "ARCHIVED"
] as const;

export type RegistryRecordStatus = (typeof REGISTRY_RECORD_STATUSES)[number];

export const GOVERNANCE_OWNER_TYPES = [
  "LGU",
  "PROVINCIAL_TOURISM",
  "DOT",
  "COMMUNITY",
  "PRIVATE_PARTNER",
  "MIXED"
] as const;

export type GovernanceOwnerType = (typeof GOVERNANCE_OWNER_TYPES)[number];

export const DESTINATION_SITE_TYPES = [
  "BEACH",
  "ISLAND",
  "PORT_TERMINAL",
  "MUNICIPAL_HALL",
  "BARANGAY_HALL",
  "TOURISM_OFFICE",
  "ACCOMMODATION",
  "FOOD_MERCHANT",
  "TRANSPORT_NODE",
  "CULTURE_SITE",
  "NATURE_SITE",
  "DIVE_SITE",
  "SURF_SITE",
  "TRAIL_STOP",
  "VIEW_DECK",
  "WATERFALL",
  "CAVE",
  "OTHER"
] as const;

export type DestinationSiteType = (typeof DESTINATION_SITE_TYPES)[number];

export interface MunicipalityRegistryRecord {
  id: string;
  code: string;
  name: string;
  provinceName: string;
  regionName: string;
  status: RegistryRecordStatus;
  governanceOwnerType: GovernanceOwnerType;
  governanceOwnerName?: string | null;
}

export interface BarangayRegistryRecord {
  id: string;
  municipalityId: string;
  code: string;
  name: string;
  status: RegistryRecordStatus;
  governanceOwnerType: GovernanceOwnerType;
  governanceOwnerName?: string | null;
}

export interface DestinationSiteRegistryRecord {
  id: string;
  municipalityId: string;
  barangayId?: string | null;
  code: string;
  name: string;
  siteType: DestinationSiteType;
  status: RegistryRecordStatus;
  governanceOwnerType: GovernanceOwnerType;
  governanceOwnerName?: string | null;
  publicSummary?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export const REGISTRY_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsRegistryTruth: false,
  standaloneDinagatPass: true,
  noFlatMarketplaceExposure: true
} as const;
