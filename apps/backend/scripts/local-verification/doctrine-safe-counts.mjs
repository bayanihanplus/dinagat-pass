import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const counts = {
  users: await prisma.user.count(),
  credentials: await prisma.authCredential.count(),
  sessions: await prisma.authSession.count(),
  activeSessions: await prisma.authSession.count({ where: { status: "ACTIVE" } }),
  revokedSessions: await prisma.authSession.count({ where: { status: "REVOKED" } }),
  auditEvents: await prisma.auditEvent.count(),
  operators: await prisma.operator.count(),
  bookings: await prisma.booking.count(),
  scanEvents: await prisma.scanEvent.count(),
  visitStamps: await prisma.visitStamp.count(),
  marketplaceExposures: await prisma.marketplaceExposure.count(),
};

console.log(JSON.stringify(counts, null, 2));

if (
  counts.users !== 1 ||
  counts.credentials < 1 ||
  counts.activeSessions !== 0 ||
  counts.operators !== 0 ||
  counts.bookings !== 0 ||
  counts.scanEvents !== 0 ||
  counts.visitStamps !== 0 ||
  counts.marketplaceExposures !== 0
) {
  console.error("VERIFY_FAIL: doctrine-safe baseline failed");
  await prisma.$disconnect();
  process.exit(1);
}

console.log("VERIFY_PASS: doctrine-safe baseline verified");

await prisma.$disconnect();
