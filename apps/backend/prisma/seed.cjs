const {
  ExperienceFamilyCode,
  PrismaClient,
  UserRole
} = require("@prisma/client");

const prisma = new PrismaClient();

const experienceFamilies = [
  {
    code: ExperienceFamilyCode.BLUE_LAGOON_PANGABANGAN,
    title: "Blue Lagoon / Pangabangan",
    sequence: 1,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.LAKE_BABABU_BASILISA_GEOSITE,
    title: "Lake Bababu / Basilisa Geosite",
    sequence: 2,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.DINAGAT_ISLAND_HOPPING,
    title: "Dinagat Island Hopping",
    sequence: 3,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.LORETO_BONSAI_FOREST_ECO,
    title: "Loreto Bonsai Forest / Eco",
    sequence: 4,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.SAN_JOSE_MYSTICAL_CULTURE,
    title: "San Jose Mystical / Culture",
    sequence: 5,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.COMMUNITY_FOOD_LOCAL_COMMERCE,
    title: "Community Food / Local Commerce",
    sequence: 6,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.ADVENTURE_CAVE_LAGOON_ECO,
    title: "Adventure Cave / Lagoon / Eco",
    sequence: 7,
    description: "Official experience-family registry placeholder. Not a product listing."
  },
  {
    code: ExperienceFamilyCode.RETURN_VISITOR_CONTINUITY,
    title: "Return Visitor Continuity",
    sequence: 8,
    description: "Official continuity-family registry placeholder. Not a product listing."
  }
];

const systemRecords = [
  {
    key: "DOCTRINE.QR_SCAN_EVENT",
    value: "operational_truth",
    description: "QR / Scan Event is the operating truth."
  },
  {
    key: "DOCTRINE.VISIT_STAMP",
    value: "derived_output",
    description: "Visit Stamp is derived from governed validation, not source truth."
  },
  {
    key: "DOCTRINE.BOOKING",
    value: "request_commercial_lifecycle",
    description: "Booking is a request and commercial lifecycle."
  },
  {
    key: "DOCTRINE.PAYMENT_READINESS",
    value: "backend_controlled",
    description: "Payment readiness is controlled by backend state."
  },
  {
    key: "DOCTRINE.OPERATOR_CAPABILITY",
    value: "fulfillment_authority",
    description: "Operator capability is fulfillment authority."
  },
  {
    key: "DOCTRINE.SITE_ACCESS_POINT",
    value: "location_action_context",
    description: "Site access point is location/action context."
  },
  {
    key: "DOCTRINE.SOURCE_ATTRIBUTION",
    value: "economic_accountability",
    description: "Source attribution preserves economic accountability."
  },
  {
    key: "DOCTRINE.MARKETPLACE_EXPOSURE",
    value: "governed_public_visibility",
    description: "Marketplace exposure is governed public visibility."
  },
  {
    key: "DOCTRINE.AUDIT_EVENT",
    value: "governance_accountability",
    description: "Audit events preserve governance accountability."
  },
  {
    key: "SEED_POLICY.BASELINE_ONLY",
    value: "true",
    description: "Seed foundation contains no fake operators, bookings, QR validations, payments, visit stamps, or product inventory."
  }
];

async function main() {
  await prisma.user.upsert({
    where: {
      email: "admin.placeholder@dinagat-pass.local"
    },
    update: {
      displayName: "Dinagat Pass Admin Placeholder",
      role: UserRole.SUPER_ADMIN,
      isActive: false
    },
    create: {
      email: "admin.placeholder@dinagat-pass.local",
      displayName: "Dinagat Pass Admin Placeholder",
      role: UserRole.SUPER_ADMIN,
      isActive: false
    }
  });

  for (const family of experienceFamilies) {
    await prisma.experienceFamilyRegistry.upsert({
      where: {
        code: family.code
      },
      update: {
        title: family.title,
        sequence: family.sequence,
        description: family.description,
        isActive: true
      },
      create: {
        code: family.code,
        title: family.title,
        sequence: family.sequence,
        description: family.description,
        isActive: true
      }
    });
  }

  for (const record of systemRecords) {
    await prisma.systemRecord.upsert({
      where: {
        key: record.key
      },
      update: {
        value: record.value,
        description: record.description
      },
      create: {
        key: record.key,
        value: record.value,
        description: record.description
      }
    });
  }

  const counts = {
    users: await prisma.user.count(),
    experienceFamilies: await prisma.experienceFamilyRegistry.count(),
    systemRecords: await prisma.systemRecord.count(),
    operators: await prisma.operator.count(),
    bookings: await prisma.booking.count(),
    scanEvents: await prisma.scanEvent.count(),
    visitStamps: await prisma.visitStamp.count(),
    marketplaceExposures: await prisma.marketplaceExposure.count()
  };

  if (
    counts.operators !== 0 ||
    counts.bookings !== 0 ||
    counts.scanEvents !== 0 ||
    counts.visitStamps !== 0 ||
    counts.marketplaceExposures !== 0
  ) {
    throw new Error("Doctrine-safe seed violation: fake commercial/operational records detected.");
  }

  console.log("Doctrine-safe seed completed:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });