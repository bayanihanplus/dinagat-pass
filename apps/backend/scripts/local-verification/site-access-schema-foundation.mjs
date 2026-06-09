import {
  PrismaClient,
  SiteAccessEligibilityType,
  SiteAccessFeeCollectionMode,
  SiteAccessFeeRuleType,
  SiteAccessOwnerType,
  SiteAccessPointStatus,
  SiteAccessPointType,
  SiteAccessQrPurpose
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "SiteAccessPoint",
  "SiteAccessQrDefinition",
  "SiteAccessFeeRule"
];

const expectedEnumValues = {
  SiteAccessPointStatus: [
    "DRAFT",
    "ACTIVE",
    "PAUSED",
    "SUSPENDED",
    "ARCHIVED"
  ],
  SiteAccessPointType: [
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
  ],
  SiteAccessOwnerType: [
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
  ],
  SiteAccessQrPurpose: [
    "SITE_CONTEXT",
    "ACCESS_CHECK_IN",
    "PAYMENT_CONTEXT",
    "STAMP_VALIDATION",
    "ARRIVAL_LOG",
    "OPERATOR_SERVICE_CHECK_IN",
    "ACCOMMODATION_CHECK_IN",
    "MERCHANT_CHECK_IN",
    "EVENT_ENTRY"
  ],
  SiteAccessFeeRuleType: [
    "NONE",
    "STANDARD",
    "RESIDENT_RATE",
    "DISCOUNTED",
    "EXEMPT",
    "SENIOR_RATE",
    "CHILD_RATE",
    "CUSTOM"
  ],
  SiteAccessFeeCollectionMode: [
    "NOT_COLLECTED",
    "CASH_ON_SITE",
    "ONLINE_PREPAY",
    "COUNTER_PAYMENT",
    "PARTNER_COLLECTED",
    "GOVERNMENT_COLLECTED",
    "MIXED"
  ],
  SiteAccessEligibilityType: [
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
  ]
};

const runtimeEnums = {
  SiteAccessPointStatus,
  SiteAccessPointType,
  SiteAccessOwnerType,
  SiteAccessQrPurpose,
  SiteAccessFeeRuleType,
  SiteAccessFeeCollectionMode,
  SiteAccessEligibilityType
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
    throw new Error(`Missing site access models: ${missingModels.join(", ")}`);
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
    siteAccessPoints: await prisma.siteAccessPoint.count(),
    siteAccessQrDefinitions: await prisma.siteAccessQrDefinition.count(),
    siteAccessFeeRules: await prisma.siteAccessFeeRule.count(),
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
    counts.siteAccessPoints !== 0 ||
    counts.siteAccessQrDefinitions !== 0 ||
    counts.siteAccessFeeRules !== 0 ||
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
    lane: "DINAGAT-PASS-MVP-SITE-ACCESS-SCHEMA-FOUNDATION-01B",
    backendOwned: true,
    frontendOwnsAccessTruth: false,
    standaloneDinagatPass: true,
    extendsExistingSiteAccessPoint: true,
    officialTravelerQrRemainsIdentity: true,
    siteAccessQrIsLocationActionContext: true,
    scanEventWillRecordActualAction: true,
    feeRulesRequireGovernanceConfiguration: true,
    noFakeAccessSuccessAllowed: true,
    requiredModels,
    requiredEnums: Object.keys(expectedEnumValues),
    enumCheck,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Site access enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Site access schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: site access schema foundation 01B verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
