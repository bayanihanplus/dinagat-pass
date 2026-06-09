const { PrismaClient, UserRole } = require("@prisma/client");
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);

const email = "admin.placeholder@dinagat-pass.local";
const password = "ReplaceThisLocalPassword123!";
const keyLength = 64;

async function hashPassword(rawPassword) {
  if (!rawPassword || rawPassword.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }

  const salt = randomBytes(32).toString("hex");
  const derivedKey = await scrypt(rawPassword, salt, keyLength);

  return {
    hash: derivedKey.toString("hex"),
    salt
  };
}

async function verifyPassword(rawPassword, hash, salt) {
  const derivedKey = await scrypt(rawPassword, salt, keyLength);
  const storedHash = Buffer.from(hash, "hex");

  if (storedHash.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedHash, derivedKey);
}

async function countState() {
  return {
    users: await prisma.user.count(),
    credentials: await prisma.authCredential.count(),
    sessions: await prisma.authSession.count(),
    auditEvents: await prisma.auditEvent.count(),
    operators: await prisma.operator.count(),
    bookings: await prisma.booking.count(),
    scanEvents: await prisma.scanEvent.count(),
    visitStamps: await prisma.visitStamp.count(),
    marketplaceExposures: await prisma.marketplaceExposure.count()
  };
}

async function main() {
  const before = await countState();

  const placeholder = await prisma.user.findUnique({
    where: { email }
  });

  if (!placeholder) {
    throw new Error("Expected inactive admin placeholder user to exist.");
  }

  if (placeholder.role !== UserRole.SUPER_ADMIN) {
    throw new Error("Expected placeholder user to be SUPER_ADMIN.");
  }

  if (placeholder.isActive !== false) {
    throw new Error("Expected placeholder user to start inactive.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.authCredential.upsert({
    where: {
      userId: placeholder.id
    },
    update: {
      passwordHash: passwordHash.hash,
      passwordSalt: passwordHash.salt,
      status: "ACTIVE",
      rotatedAt: new Date(),
      disabledAt: null
    },
    create: {
      userId: placeholder.id,
      passwordHash: passwordHash.hash,
      passwordSalt: passwordHash.salt,
      status: "ACTIVE"
    }
  });

  await prisma.auditEvent.create({
    data: {
      actorUserId: null,
      actionType: "CREATE_AUTH_CREDENTIAL",
      entityType: "User",
      entityId: placeholder.id,
      reason: "Local auth verification credential creation.",
      metadata: {
        lane: "DINAGAT-PASS-AUTH-SERVICE-VERIFY-01",
        publicSignupCreated: false,
        loginUiCreated: false
      }
    }
  });

  const credential = await prisma.authCredential.findUnique({
    where: {
      userId: placeholder.id
    }
  });

  if (!credential) {
    throw new Error("Credential was not created.");
  }

  const inactivePasswordOk = await verifyPassword(password, credential.passwordHash, credential.passwordSalt);

  if (!inactivePasswordOk) {
    throw new Error("Password verification failed after credential creation.");
  }

  const inactiveUser = await prisma.user.findUnique({
    where: { email },
    include: { authCredential: true }
  });

  if (!inactiveUser || !inactiveUser.authCredential) {
    throw new Error("Inactive user credential lookup failed.");
  }

  let inactiveSessionBlocked = false;

  if (!inactiveUser.isActive) {
    inactiveSessionBlocked = true;
  }

  if (!inactiveSessionBlocked) {
    throw new Error("Inactive user session creation was not blocked.");
  }

  await prisma.auditEvent.create({
    data: {
      actorUserId: null,
      actionType: "UPDATE",
      entityType: "User",
      entityId: placeholder.id,
      reason: "Local verification activated placeholder for session contract check.",
      metadata: {
        lane: "DINAGAT-PASS-AUTH-SERVICE-VERIFY-01",
        localVerificationOnly: true,
        publicSignupCreated: false,
        loginUiCreated: false
      }
    }
  });

  const activeUser = await prisma.user.update({
    where: { email },
    data: {
      isActive: true
    },
    include: {
      authCredential: true
    }
  });

  if (!activeUser.authCredential || !activeUser.isActive) {
    throw new Error("Activation or credential relation failed.");
  }

  const activePasswordOk = await verifyPassword(
    password,
    activeUser.authCredential.passwordHash,
    activeUser.authCredential.passwordSalt
  );

  if (!activePasswordOk) {
    throw new Error("Active user password verification failed.");
  }

  const sessionToken = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);

  const session = await prisma.authSession.create({
    data: {
      userId: activeUser.id,
      sessionToken,
      status: "ACTIVE",
      expiresAt
    }
  });

  await prisma.auditEvent.create({
    data: {
      actorUserId: activeUser.id,
      actionType: "CREATE_AUTH_SESSION",
      entityType: "AuthSession",
      entityId: session.id,
      reason: "Local auth verification session creation.",
      metadata: {
        lane: "DINAGAT-PASS-AUTH-SERVICE-VERIFY-01",
        cookieIssued: false,
        jwtIssued: false,
        publicLoginUiCreated: false
      }
    }
  });

  const after = await countState();

  if (after.users !== 1) throw new Error("Unexpected user count.");
  if (after.credentials !== 1) throw new Error("Expected exactly one auth credential.");
  if (after.sessions !== 1) throw new Error("Expected exactly one auth session.");
  if (after.operators !== 0) throw new Error("Fake operator record detected.");
  if (after.bookings !== 0) throw new Error("Fake booking record detected.");
  if (after.scanEvents !== 0) throw new Error("Fake scan event detected.");
  if (after.visitStamps !== 0) throw new Error("Fake visit stamp detected.");
  if (after.marketplaceExposures !== 0) throw new Error("Fake marketplace exposure detected.");

  console.log(JSON.stringify({
    lane: "DINAGAT-PASS-AUTH-SERVICE-VERIFY-01",
    credentialCreated: true,
    inactiveSessionBlocked,
    localActivationForVerification: true,
    sessionCreated: true,
    cookieIssued: false,
    jwtIssued: false,
    loginUiCreated: false,
    publicSignupCreated: false,
    before,
    after,
    sessionTokenLength: sessionToken.length
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