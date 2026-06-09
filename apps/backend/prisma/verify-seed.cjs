const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
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

  console.log(JSON.stringify(counts, null, 2));

  if (counts.users !== 1) process.exit(11);
  if (counts.experienceFamilies !== 8) process.exit(12);
  if (counts.systemRecords < 10) process.exit(13);
  if (counts.operators !== 0) process.exit(14);
  if (counts.bookings !== 0) process.exit(15);
  if (counts.scanEvents !== 0) process.exit(16);
  if (counts.visitStamps !== 0) process.exit(17);
  if (counts.marketplaceExposures !== 0) process.exit(18);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });