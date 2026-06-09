const { PrismaClient } = require("@prisma/client");
const { createHash } = require("node:crypto");

const prisma = new PrismaClient();

const email = "admin.placeholder@dinagat-pass.local";
const password = "ReplaceThisLocalPassword123!";

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function main() {
  const before = {
    sessions: await prisma.authSession.count(),
    auditEvents: await prisma.auditEvent.count()
  };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { authCredential: true }
  });

  if (!user || !user.isActive || !user.authCredential) {
    throw new Error("Expected verified active user with credential from previous lane.");
  }

  if ("sessionToken" in (await prisma.authSession.findFirst().catch(() => ({})) ?? {})) {
    throw new Error("Raw sessionToken field should not be used.");
  }

  console.log(JSON.stringify({
    lane: "DINAGAT-PASS-AUTH-HARDENING-01",
    precheck: true,
    userActive: user.isActive,
    hasCredential: Boolean(user.authCredential),
    before
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });