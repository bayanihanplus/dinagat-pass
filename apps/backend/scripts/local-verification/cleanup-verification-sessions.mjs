import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.argv[2] ?? "admin.placeholder@dinagat-pass.local";

const user = await prisma.user.findUnique({
  where: { email },
});

if (!user) {
  console.error(`VERIFY_FAIL: user not found: ${email}`);
  await prisma.$disconnect();
  process.exit(1);
}

const activeBefore = await prisma.authSession.count({
  where: {
    userId: user.id,
    status: "ACTIVE",
  },
});

const updated = await prisma.authSession.updateMany({
  where: {
    userId: user.id,
    status: "ACTIVE",
  },
  data: {
    status: "REVOKED",
    revokedAt: new Date(),
  },
});

const activeAfter = await prisma.authSession.count({
  where: {
    userId: user.id,
    status: "ACTIVE",
  },
});

console.log(JSON.stringify({
  userId: user.id,
  email: user.email,
  activeBefore,
  revokedByCleanup: updated.count,
  activeAfter,
}, null, 2));

if (activeAfter !== 0) {
  console.error("VERIFY_FAIL: active sessions remain after cleanup");
  await prisma.$disconnect();
  process.exit(1);
}

console.log("VERIFY_PASS: active verification sessions cleaned");

await prisma.$disconnect();
