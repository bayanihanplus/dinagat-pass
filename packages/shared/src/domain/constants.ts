export const DINAGAT_PASS_PRODUCT = {
  name: "Dinagat Pass",
  repo: "dinagat-pass",
  standalone: true,
  ospRelationship: "architectural-reference-only"
} as const;

export const DINAGAT_OPERATING_TRUTH = {
  qrScanEvent: "operational_truth",
  visitStamp: "derived_output",
  booking: "request_commercial_lifecycle",
  paymentReadiness: "backend_controlled",
  operatorCapability: "fulfillment_authority",
  siteAccessPoint: "location_action_context",
  sourceAttribution: "economic_accountability",
  marketplaceExposure: "governed_public_visibility",
  auditEvent: "governance_accountability"
} as const;

export const DINAGAT_EXPERIENCE_FAMILIES = [
  "BLUE_LAGOON_PANGABANGAN",
  "LAKE_BABABU_BASILISA_GEOSITE",
  "DINAGAT_ISLAND_HOPPING",
  "LORETO_BONSAI_FOREST_ECO",
  "SAN_JOSE_MYSTICAL_CULTURE",
  "COMMUNITY_FOOD_LOCAL_COMMERCE",
  "ADVENTURE_CAVE_LAGOON_ECO",
  "RETURN_VISITOR_CONTINUITY"
] as const;

export const DINAGAT_PRODUCT_CATEGORIES = [
  "DINAGAT_PARTNER_TOUR",
  "DINAGAT_CURATED_EXPERIENCE_TRAIL",
  "BUILD_YOUR_OWN_DINAGAT_TRAIL"
] as const;

export type DinagatOperatingTruthKey = keyof typeof DINAGAT_OPERATING_TRUTH;
export type DinagatExperienceFamily = typeof DINAGAT_EXPERIENCE_FAMILIES[number];
export type DinagatProductCategory = typeof DINAGAT_PRODUCT_CATEGORIES[number];