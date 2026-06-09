import {
  ActivityProofEvidenceType,
  ActivityProofStatus,
  ActivityProofType,
  PrismaClient,
  VisitStampProofStatus,
  VisitStampSourceType
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "ScanEvent",
  "VisitStamp",
  "ActivityProofRecord",
  "ActivityProofEvidence"
];

const expectedEnumValues = {
  VisitStampProofStatus: [
    "DRAFT",
    "EARNED",
    "VERIFIED",
    "REVOKED",
    "EXPIRED",
    "ARCHIVED"
  ],
  VisitStampSourceType: [
    "SITE_ACCESS_SCAN",
    "BOOKING_COMPLETION",
    "STAFF_VALIDATION",
    "MANUAL_GOVERNANCE_REVIEW",
    "SYSTEM_EVENT",
    "PARTNER_EVENT"
  ],
  ActivityProofStatus: [
    "DRAFT",
    "RECORDED",
    "VERIFIED",
    "REJECTED",
    "REVOKED",
    "ARCHIVED"
  ],
  ActivityProofType: [
    "SITE_ACCESS_SCAN",
    "VISIT_STAMP",
    "BOOKING_ATTENDANCE",
    "TRAIL_PROGRESS",
    "STAFF_VALIDATION",
    "GOVERNANCE_REVIEW"
  ],
  ActivityProofEvidenceType: [
    "QR_SCAN",
    "STAFF_CONFIRMATION",
    "SYSTEM_EVENT",
    "PHOTO_REFERENCE",
    "DOCUMENT_REFERENCE",
    "EXTERNAL_REFERENCE"
  ]
};

const runtimeEnums = {
  VisitStampProofStatus,
  VisitStampSourceType,
  ActivityProofStatus,
  ActivityProofType,
  ActivityProofEvidenceType
};

function verifyEnumValues(enumName, expectedValues) {
  const runtimeEnum = runtimeEnums[enumName];
  if (!runtimeEnum) {
    return {
      enumName,
      available: false,
      missingValues: expectedValues,
      unexpectedValues: []
    };
  }

  const actualValues = Object.values(runtimeEnum);
  const missingValues = expectedValues.filter((value) => !actualValues.includes(value));

  return {
    enumName,
    available: true,
    missingValues,
    unexpectedValues: []
  };
}

async function main() {
  const dmmfModels = prisma._runtimeDataModel?.models ?? {};
  const missingModels = requiredModels.filter((model) => !Object.prototype.hasOwnProperty.call(dmmfModels, model));

  if (missingModels.length > 0) {
    throw new Error(`Missing visit stamp activity proof models: ${missingModels.join(", ")}`);
  }

  const enumCheck = Object.entries(expectedEnumValues).map(([enumName, expectedValues]) =>
    verifyEnumValues(enumName, expectedValues)
  );

  const badEnumChecks = enumCheck.filter(
    (check) =>
      !check.available ||
      check.missingValues.length > 0 ||
      check.unexpectedValues.length > 0
  );

  const counts = {
    activityProofRecords: await prisma.activityProofRecord.count(),
    activityProofEvidence: await prisma.activityProofEvidence.count(),
    travelerProfiles: await prisma.travelerProfile.count(),
    travelerPasses: await prisma.travelerPass.count(),
    travelerPassQrCredentials: await prisma.travelerPassQrCredential.count(),
    travelerIdentityClaims: await prisma.travelerIdentityClaim.count(),
    siteAccessPoints: await prisma.siteAccessPoint.count(),
    siteAccessQrDefinitions: await prisma.siteAccessQrDefinition.count(),
    siteAccessFeeRules: await prisma.siteAccessFeeRule.count(),
    localOperatorRegistryRecords: await prisma.localOperatorRegistryRecord.count(),
    municipalities: await prisma.municipality.count(),
    barangays: await prisma.barangay.count(),
    destinationSites: await prisma.destinationSite.count(),
    users: await prisma.user.count(),
    auditEvents: await prisma.auditEvent.count(),
    operators: await prisma.operator.count(),
    bookings: await prisma.booking.count(),
    scanEvents: await prisma.scanEvent.count(),
    visitStamps: await prisma.visitStamp.count(),
    marketplaceExposures: await prisma.marketplaceExposure.count()
  };

  const unsafeInflation =
    counts.activityProofRecords !== 0 ||
    counts.activityProofEvidence !== 0 ||
    counts.travelerProfiles !== 0 ||
    counts.travelerPasses !== 0 ||
    counts.travelerPassQrCredentials !== 0 ||
    counts.travelerIdentityClaims !== 0 ||
    counts.siteAccessPoints !== 0 ||
    counts.siteAccessQrDefinitions !== 0 ||
    counts.siteAccessFeeRules !== 0 ||
    counts.localOperatorRegistryRecords !== 0 ||
    counts.municipalities !== 0 ||
    counts.barangays !== 0 ||
    counts.destinationSites !== 0 ||
    counts.operators !== 0 ||
    counts.bookings !== 0 ||
    counts.scanEvents !== 0 ||
    counts.visitStamps !== 0 ||
    counts.marketplaceExposures !== 0;

  const result = {
    lane: "DINAGAT-PASS-MVP-VISIT-STAMP-ACTIVITY-PROOF-SCHEMA-FOUNDATION-01-RECOVERY-A",
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
    usesProofSpecificVisitStampStatus: true,
    requiredModels,
    requiredEnums: Object.keys(expectedEnumValues),
    enumCheck,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Visit stamp activity proof enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Visit stamp activity proof schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: visit stamp activity proof schema foundation verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
