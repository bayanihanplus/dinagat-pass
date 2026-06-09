import {
  PrismaClient,
  TravelerIdentityClaimStatus,
  TravelerIdentityClaimType,
  TravelerPassIdentityStatus,
  TravelerPassQrCredentialPurpose,
  TravelerPassQrCredentialStatus
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "TravelerPass",
  "TravelerProfile",
  "TravelerPassQrCredential",
  "TravelerIdentityClaim"
];

const expectedEnumValues = {
  TravelerPassIdentityStatus: [
    "DRAFT",
    "ACTIVE",
    "PAUSED",
    "REVOKED",
    "ARCHIVED"
  ],
  TravelerPassQrCredentialStatus: [
    "DRAFT",
    "ACTIVE",
    "ROTATED",
    "REVOKED",
    "EXPIRED",
    "ARCHIVED"
  ],
  TravelerPassQrCredentialPurpose: [
    "TRAVELER_IDENTITY",
    "SITE_ACCESS_SCAN",
    "BOOKING_CONTEXT",
    "STAFF_VALIDATION",
    "GOVERNANCE_AUDIT"
  ],
  TravelerIdentityClaimType: [
    "EMAIL",
    "PHONE",
    "NAME_REFERENCE",
    "DOCUMENT_REFERENCE",
    "MANUAL_GOVERNANCE_REFERENCE",
    "EXTERNAL_REFERENCE"
  ],
  TravelerIdentityClaimStatus: [
    "DRAFT",
    "CLAIMED",
    "VERIFIED",
    "REJECTED",
    "REVOKED",
    "ARCHIVED"
  ]
};

const runtimeEnums = {
  TravelerPassIdentityStatus,
  TravelerPassQrCredentialStatus,
  TravelerPassQrCredentialPurpose,
  TravelerIdentityClaimType,
  TravelerIdentityClaimStatus
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
  const unexpectedValues = actualValues.filter((value) => !expectedValues.includes(value));

  return {
    enumName,
    available: true,
    missingValues,
    unexpectedValues
  };
}

async function main() {
  const dmmfModels = prisma._runtimeDataModel?.models ?? {};
  const missingModels = requiredModels.filter((model) => !Object.prototype.hasOwnProperty.call(dmmfModels, model));

  if (missingModels.length > 0) {
    throw new Error(`Missing traveler pass identity models: ${missingModels.join(", ")}`);
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
    lane: "DINAGAT-PASS-MVP-TRAVELER-PASS-IDENTITY-SCHEMA-FOUNDATION-01",
    backendOwned: true,
    frontendOwnsIdentityTruth: false,
    standaloneDinagatPass: true,
    officialTravelerQrRemainsIdentity: true,
    qrTokenHashOnly: true,
    rawQrTokenStorageAllowed: false,
    siteAccessQrDoesNotReplaceTravelerQr: true,
    scanEventWillRecordActualAction: true,
    noFakeTravelerQrSuccessAllowed: true,
    requiredModels,
    requiredEnums: Object.keys(expectedEnumValues),
    enumCheck,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Traveler pass identity enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Traveler pass identity schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: traveler pass identity schema foundation verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
