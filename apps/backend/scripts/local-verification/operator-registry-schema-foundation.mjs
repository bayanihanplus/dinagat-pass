import {
  LocalOperatorAccreditationStatus,
  LocalOperatorCapabilityCategory,
  LocalOperatorCommercialReadinessStatus,
  LocalOperatorComplianceSeverity,
  LocalOperatorExposureStatus,
  LocalOperatorProviderType,
  LocalOperatorVerificationStatus,
  PrismaClient
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "LocalOperatorRegistryRecord",
  "LocalOperatorCapabilityRecord",
  "LocalOperatorComplianceRecord"
];

const expectedEnumValues = {
  LocalOperatorProviderType: [
    "TOUR_OPERATOR",
    "TRANSPORT_PROVIDER",
    "ACCOMMODATION_PROVIDER",
    "FOOD_MERCHANT",
    "GUIDE",
    "COMMUNITY_ORGANIZATION",
    "LGU_OPERATED",
    "MIXED_PROVIDER"
  ],
  LocalOperatorVerificationStatus: [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "VERIFIED",
    "REJECTED",
    "SUSPENDED",
    "ARCHIVED"
  ],
  LocalOperatorAccreditationStatus: [
    "NOT_PROVIDED",
    "PENDING_REVIEW",
    "DOT_ACCREDITED",
    "LGU_RECOGNIZED",
    "PROVISIONAL",
    "EXPIRED",
    "REJECTED"
  ],
  LocalOperatorCapabilityCategory: [
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
  ],
  LocalOperatorCommercialReadinessStatus: [
    "NOT_READY",
    "PROFILE_ONLY",
    "REQUEST_TO_CONFIRM",
    "PRICING_READY",
    "BOOKING_READY",
    "SUSPENDED"
  ],
  LocalOperatorExposureStatus: [
    "HIDDEN",
    "ELIGIBLE_FOR_REVIEW",
    "APPROVED_FOR_EXPOSURE",
    "SUSPENDED",
    "BLOCKED"
  ],
  LocalOperatorComplianceSeverity: [
    "INFO",
    "WARNING",
    "RESTRICTION",
    "SUSPENSION",
    "BLOCKER"
  ]
};

const runtimeEnums = {
  LocalOperatorProviderType,
  LocalOperatorVerificationStatus,
  LocalOperatorAccreditationStatus,
  LocalOperatorCapabilityCategory,
  LocalOperatorCommercialReadinessStatus,
  LocalOperatorExposureStatus,
  LocalOperatorComplianceSeverity
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
    throw new Error(`Missing operator registry models: ${missingModels.join(", ")}`);
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
    localOperatorRegistryRecords: await prisma.localOperatorRegistryRecord.count(),
    localOperatorCapabilityRecords: await prisma.localOperatorCapabilityRecord.count(),
    localOperatorComplianceRecords: await prisma.localOperatorComplianceRecord.count(),
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
    counts.localOperatorRegistryRecords !== 0 ||
    counts.localOperatorCapabilityRecords !== 0 ||
    counts.localOperatorComplianceRecords !== 0 ||
    counts.municipalities !== 0 ||
    counts.barangays !== 0 ||
    counts.destinationSites !== 0 ||
    counts.operators !== 0 ||
    counts.bookings !== 0 ||
    counts.scanEvents !== 0 ||
    counts.visitStamps !== 0 ||
    counts.marketplaceExposures !== 0;

  const result = {
    lane: "DINAGAT-PASS-MVP-OPERATOR-REGISTRY-SCHEMA-FOUNDATION-01",
    backendOwned: true,
    frontendOwnsOperatorTruth: false,
    standaloneDinagatPass: true,
    flatMarketplaceExposureAllowed: false,
    exposureRequiresGovernanceGates: true,
    requiredModels,
    requiredEnums: Object.keys(expectedEnumValues),
    enumCheck,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Operator registry enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Operator registry schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: operator registry schema foundation verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
