import { Injectable } from "@nestjs/common";
import {
  AuthCredentialStatus,
  AuthSessionStatus
} from "@prisma/client";
import { PrismaService } from "../../prisma";
import { PasswordService } from "../password";
import { SessionTokenService } from "../session";
import {
  CreateCredentialInput,
  CreateCredentialResult,
  CreateSessionInput,
  CreateSessionResult
} from "../dto";

export interface ResolveSessionResult {
  valid: boolean;
  userId: string | null;
  email: string | null;
  role: string | null;
  sessionId: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly sessionTokenService: SessionTokenService
  ) {}

  async createCredential(input: CreateCredentialInput): Promise<CreateCredentialResult> {
    this.assertEmail(input.email);

    const normalizedEmail = input.email.toLowerCase();
    const normalizedDisplayName = input.displayName ?? null;
    const isActive = input.isActive ?? false;
    const passwordHash = await this.passwordService.hashPassword(input.password);

    const user = await this.prisma.user.upsert({
      where: {
        email: normalizedEmail
      },
      update: {
        displayName: normalizedDisplayName,
        role: input.role,
        isActive
      },
      create: {
        email: normalizedEmail,
        displayName: normalizedDisplayName,
        role: input.role,
        isActive
      }
    });

    await this.prisma.authCredential.upsert({
      where: {
        userId: user.id
      },
      update: {
        passwordHash: passwordHash.hash,
        passwordSalt: passwordHash.salt,
        status: AuthCredentialStatus.ACTIVE,
        rotatedAt: new Date(),
        disabledAt: null
      },
      create: {
        userId: user.id,
        passwordHash: passwordHash.hash,
        passwordSalt: passwordHash.salt,
        status: AuthCredentialStatus.ACTIVE
      }
    });

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: null,
        actionType: "CREATE_AUTH_CREDENTIAL",
        entityType: "User",
        entityId: user.id,
        reason: "Auth service credential creation contract.",
        metadata: {
          lane: "DINAGAT-PASS-AUTH-HARDENING-01",
          sessionIssued: false,
          publicSignupCreated: false
        }
      }
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      credentialCreated: true,
      sessionIssued: false
    };
  }

  async createSession(input: CreateSessionInput): Promise<CreateSessionResult> {
    this.assertEmail(input.email);

    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email.toLowerCase()
      },
      include: {
        authCredential: true
      }
    });

    if (!user || !user.authCredential || !user.isActive) {
      throw new Error("Invalid credentials or inactive user.");
    }

    if (user.authCredential.status !== AuthCredentialStatus.ACTIVE) {
      throw new Error("Credential is not active.");
    }

    const passwordOk = await this.passwordService.verifyPassword(
      input.password,
      user.authCredential.passwordHash,
      user.authCredential.passwordSalt
    );

    if (!passwordOk) {
      throw new Error("Invalid credentials or inactive user.");
    }

    const sessionToken = this.sessionTokenService.createSessionToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);

    const session = await this.prisma.authSession.create({
      data: {
        userId: user.id,
        sessionTokenHash: sessionToken.tokenHash,
        status: AuthSessionStatus.ACTIVE,
        expiresAt
      }
    });

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: user.id,
        actionType: "CREATE_AUTH_SESSION",
        entityType: "AuthSession",
        entityId: session.id,
        reason: "Auth service hardened session contract.",
        metadata: {
          lane: "DINAGAT-PASS-AUTH-HARDENING-01",
          rawTokenStored: false,
          cookieIssued: false,
          jwtIssued: false,
          loginUiCreated: false
        }
      }
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionToken: sessionToken.token,
      expiresAt: expiresAt.toISOString(),
      sessionIssued: true
    };
  }

  async resolveSession(rawToken: string): Promise<ResolveSessionResult> {
    if (!rawToken) {
      return this.invalidSession();
    }

    const tokenHash = this.sessionTokenService.hashToken(rawToken);

    const session = await this.prisma.authSession.findUnique({
      where: {
        sessionTokenHash: tokenHash
      },
      include: {
        user: true
      }
    });

    if (!session || session.status !== AuthSessionStatus.ACTIVE || session.expiresAt <= new Date()) {
      return this.invalidSession();
    }

    if (!session.user.isActive) {
      return this.invalidSession();
    }

    return {
      valid: true,
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId: session.id
    };
  }

  async revokeSession(rawToken: string, reason = "Session revoked."): Promise<{ revoked: boolean }> {
    const resolved = await this.resolveSession(rawToken);

    if (!resolved.valid || !resolved.sessionId) {
      return {
        revoked: false
      };
    }

    await this.prisma.authSession.update({
      where: {
        id: resolved.sessionId
      },
      data: {
        status: AuthSessionStatus.REVOKED,
        revokedAt: new Date()
      }
    });

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: resolved.userId,
        actionType: "REVOKE_AUTH_SESSION",
        entityType: "AuthSession",
        entityId: resolved.sessionId,
        reason,
        metadata: {
          lane: "DINAGAT-PASS-AUTH-HARDENING-01"
        }
      }
    });

    return {
      revoked: true
    };
  }

  async getAuthReadiness() {
    const users = await this.prisma.user.count();
    const credentials = await this.prisma.authCredential.count();
    const sessions = await this.prisma.authSession.count();
    const activeSessions = await this.prisma.authSession.count({
      where: {
        status: AuthSessionStatus.ACTIVE
      }
    });
    const revokedSessions = await this.prisma.authSession.count({
      where: {
        status: AuthSessionStatus.REVOKED
      }
    });

    return {
      serviceReady: true,
      credentialContractReady: true,
      sessionContractReady: true,
      sessionHashingReady: true,
      sessionRevocationReady: true,
      users,
      credentials,
      sessions,
      activeSessions,
      revokedSessions,
      loginUiCreated: false,
      publicSignupCreated: false,
      cookieIssuedByController: false,
      jwtIssuedByController: false
    };
  }

  private invalidSession(): ResolveSessionResult {
    return {
      valid: false,
      userId: null,
      email: null,
      role: null,
      sessionId: null
    };
  }

  private assertEmail(email: string): void {
    if (!email || !email.includes("@")) {
      throw new Error("Valid email is required.");
    }
  }
}