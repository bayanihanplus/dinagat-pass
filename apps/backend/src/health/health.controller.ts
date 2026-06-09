import { Controller, Get, Inject } from "@nestjs/common";
import { DINAGAT_AUTH_DOCTRINE, DINAGAT_OPERATING_TRUTH, DINAGAT_PASS_PRODUCT } from "@dinagat-pass/shared";
import { AuthService } from "../auth";
import { APP_CONFIG } from "../config";
import { AppConfig } from "../config/config.types";
import { PrismaService } from "../prisma";

@Controller()
export class HealthController {
  constructor(
    @Inject(APP_CONFIG)
    private readonly config: AppConfig,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  @Get("health")
  async getHealth() {
    const database = await this.prisma.checkDatabaseReadiness();
    const authReadiness = await this.authService.getAuthReadiness();

    return {
      app: "Dinagat Pass Backend",
      status: database.connected ? "ok" : "degraded",
      lane: "DINAGAT-PASS-AUTH-HARDENING-01",
      product: DINAGAT_PASS_PRODUCT,
      config: {
        appName: this.config.appName,
        appEnv: this.config.appEnv,
        appUrl: this.config.appUrl,
        databaseProvider: this.config.databaseProvider,
        databaseUrlConfigured: Boolean(this.config.databaseUrl),
        authSecretConfigured: this.config.authSecretConfigured,
        qrSigningSecretConfigured: this.config.qrSigningSecretConfigured
      },
      database,
      auth: {
        foundationReady: true,
        serviceReady: authReadiness.serviceReady,
        credentialContractReady: authReadiness.credentialContractReady,
        sessionContractReady: authReadiness.sessionContractReady,
        sessionHashingReady: authReadiness.sessionHashingReady,
        sessionRevocationReady: authReadiness.sessionRevocationReady,
        backendOwned: true,
        passwordHashingReady: true,
        roleGuardSkeletonReady: true,
        capabilityGuardSkeletonReady: true,
        users: authReadiness.users,
        credentials: authReadiness.credentials,
        sessions: authReadiness.sessions,
        activeSessions: authReadiness.activeSessions,
        revokedSessions: authReadiness.revokedSessions,
        loginUiCreated: false,
        publicSignupCreated: false,
        cookieIssuedByController: false,
        jwtIssuedByController: false,
        doctrine: DINAGAT_AUTH_DOCTRINE
      },
      doctrine: DINAGAT_OPERATING_TRUTH,
      backendAuthority: true,
      runtimeDatabaseQueryInThisLane: true,
      productWorkflowsImplemented: false
    };
  }
}