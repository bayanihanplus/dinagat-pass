import {
  DestinationSiteType,
  GovernanceOwnerType,
  PrismaClient,
  RegistryRecordStatus
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "Municipality",
  "Barangay",
  "DestinationSite"
];

const requiredEnums = [
  "RegistryRecordStatus",
  "DestinationSiteType",
  "GovernanceOwnerType"
];

const expectedEnumValues = {
  RegistryRecordStatus: [
    "DRAFT",
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "ARCHIVED"
  ],
  DestinationSiteType: [
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
  ],
  GovernanceOwnerType: [
    "LGU",
    "PROVINCIAL_TOURISM",
    "DOT",
    "COMMUNITY",
    "PRIVATE_PARTNER",
    "MIXED"
  ]
};

const runtimeEnums = {
  RegistryRecordStatus,
  DestinationSiteType,
  GovernanceOwnerType
};

const expectedZeroTables = [
  "Municipality",
  "Barangay",
  "DestinationSite"
];

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
    throw new Error(`Missing Prisma registry models: ${missingModels.join(", ")}`);
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
    counts.municipalities !== 0 ||
    counts.barangays !== 0 ||
    counts.destinationSites !== 0 ||
    counts.operators !== 0 ||
    counts.bookings !== 0 ||
    counts.scanEvents !== 0 ||
    counts.visitStamps !== 0 ||
    counts.marketplaceExposures !== 0;

  const result = {
    lane: "DINAGAT-PASS-MVP-REGISTRY-SCHEMA-FOUNDATION-01",
    auditLane: "DINAGAT-PASS-MVP-REGISTRY-SCHEMA-FOUNDATION-AUDIT-01",
    backendOwned: true,
    frontendOwnsRegistryTruth: false,
    standaloneDinagatPass: true,
    requiredModels,
    requiredEnums,
    enumCheck,
    expectedZeroTables,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Registry enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Registry schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: registry schema foundation verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
