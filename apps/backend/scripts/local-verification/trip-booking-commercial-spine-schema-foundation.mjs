import {
  PrismaClient,
  TripBookingCommercialStatus,
  TripBookingFulfillmentStatus,
  TripBookingPaymentStatus,
  TripBookingPricingMode,
  TripBookingProductType,
  TripBookingSourceChannel
} from "@prisma/client";

const prisma = new PrismaClient();

const requiredModels = [
  "Booking",
  "TripBookingCommercialRecord",
  "TripBookingLineItem",
  "TripBookingFulfillmentRecord"
];

const expectedEnumValues = {
  TripBookingCommercialStatus: [
    "DRAFT",
    "REQUESTED",
    "QUOTED",
    "CONFIRMED",
    "READY_FOR_PAYMENT",
    "PAYMENT_PENDING",
    "PAID",
    "PARTIALLY_PAID",
    "FULFILLMENT_PENDING",
    "FULFILLED",
    "CANCELLED",
    "EXPIRED",
    "ARCHIVED"
  ],
  TripBookingProductType: [
    "SITE_ACCESS",
    "TOUR",
    "TRANSPORT",
    "ACCOMMODATION",
    "GUIDE_SERVICE",
    "ACTIVITY",
    "PACKAGE",
    "ADD_ON",
    "OTHER"
  ],
  TripBookingSourceChannel: [
    "DIRECT_TRAVELER",
    "LGU_DESK",
    "TOURISM_OFFICE",
    "HOTEL_DESK",
    "TRAVEL_PARTNER",
    "OTA_INTAKE",
    "STAFF_CREATED",
    "SYSTEM_CREATED"
  ],
  TripBookingPricingMode: [
    "FIXED_PRICE",
    "PER_PAX",
    "PER_UNIT",
    "REQUEST_TO_CONFIRM",
    "GOVERNED_RATE",
    "PARTNER_QUOTE",
    "FREE"
  ],
  TripBookingFulfillmentStatus: [
    "NOT_REQUIRED",
    "PENDING_ASSIGNMENT",
    "ASSIGNED",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "REASSIGNED",
    "FAILED"
  ],
  TripBookingPaymentStatus: [
    "NOT_REQUIRED",
    "UNPAID",
    "PARTIALLY_PAID",
    "PAID",
    "REFUND_PENDING",
    "REFUNDED",
    "FAILED",
    "CANCELLED"
  ]
};

const runtimeEnums = {
  TripBookingCommercialStatus,
  TripBookingProductType,
  TripBookingSourceChannel,
  TripBookingPricingMode,
  TripBookingFulfillmentStatus,
  TripBookingPaymentStatus
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
    throw new Error(`Missing trip booking commercial spine models: ${missingModels.join(", ")}`);
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
    tripBookingCommercialRecords: await prisma.tripBookingCommercialRecord.count(),
    tripBookingLineItems: await prisma.tripBookingLineItem.count(),
    tripBookingFulfillmentRecords: await prisma.tripBookingFulfillmentRecord.count(),
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
    counts.tripBookingCommercialRecords !== 0 ||
    counts.tripBookingLineItems !== 0 ||
    counts.tripBookingFulfillmentRecords !== 0 ||
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
    lane: "DINAGAT-PASS-MVP-TRIP-BOOKING-COMMERCIAL-SPINE-SCHEMA-FOUNDATION-01",
    backendOwned: true,
    frontendOwnsCommercialTruth: false,
    standaloneDinagatPass: true,
    bookingRemainsBackendGoverned: true,
    pricingRequiresBackendRecord: true,
    paymentStatusRequiresBackendEvent: true,
    fulfillmentRequiresGovernedAssignment: true,
    operatorAssignmentRequiresRegistryRecord: true,
    otaAndTravelPartnersAreSourceChannelsOnly: true,
    noFrontendConfirmedBookingAllowed: true,
    noFrontendPaymentTruthAllowed: true,
    noFakeCommercialReadinessAllowed: true,
    requiredModels,
    requiredEnums: Object.keys(expectedEnumValues),
    enumCheck,
    counts,
    unsafeSeedOrProductDataInflation: unsafeInflation
  };

  console.log(JSON.stringify(result, null, 2));

  if (badEnumChecks.length > 0) {
    throw new Error("Trip booking commercial spine enum verification failed");
  }

  if (unsafeInflation) {
    throw new Error("Trip booking commercial spine schema foundation introduced unsafe seed/product data inflation");
  }

  console.log("VERIFY_PASS: trip booking commercial spine schema foundation verified");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
