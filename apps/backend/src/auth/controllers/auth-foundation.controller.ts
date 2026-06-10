import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { RequireCapabilities, RequireRoles } from "../decorators";
import { CreateCredentialInput } from "../dto";
import { AuthRequiredGuard, CapabilityGuard, RoleGuard } from "../guards";
import { AuthService } from "../services";

interface LocalCreateCredentialBody {
  email?: string;
  displayName?: string;
  role?: UserRole;
  password?: string;
  isActive?: boolean;
}

interface LocalCreateSessionBody {
  email?: string;
  password?: string;
}

@Controller("internal/auth-foundation")
export class AuthFoundationController {
  constructor(private readonly authService: AuthService) {}

  @Get("readiness")
  getReadiness() {
    this.assertFoundationEndpointAllowed();

    return this.authService.getAuthReadiness();
  }

  @Post("credential")
  createCredential(@Body() body: LocalCreateCredentialBody) {
    this.assertFoundationEndpointAllowed();

    const credentialInput: CreateCredentialInput = {
      email: this.requireEmail(body.email),
      role: this.requireUserRole(body.role),
      password: this.requirePassword(body.password),
      isActive: body.isActive ?? false
    };

    const displayName = body.displayName?.trim();

    if (displayName) {
      credentialInput.displayName = displayName;
    }

    return this.authService.createCredential(credentialInput);
  }

  @Post("session")
  createSession(@Body() body: LocalCreateSessionBody) {
    this.assertFoundationEndpointAllowed();

    return this.authService.createSession({
      email: this.requireEmail(body.email),
      password: this.requirePassword(body.password)
    });
  }

  @Get("protected-check")
  @UseGuards(AuthRequiredGuard)
  protectedCheck() {
    return {
      protected: true,
      backendOwned: true,
      lane: "DINAGAT-PASS-AUTH-HARDENING-01"
    };
  }

  @Get("context-check")
  @UseGuards(AuthRequiredGuard)
  contextCheck(@Req() request: RequestWithAuthContext) {
    return {
      authenticated: true,
      backendOwned: true,
      lane: "DINAGAT-PASS-AUTH-CONTEXT-CAPABILITY-GUARDS-01",
      authContext: {
        userId: request.auth?.userId,
        email: request.auth?.email,
        role: request.auth?.role,
        isActive: request.auth?.isActive,
        sessionResolved: Boolean(request.auth?.sessionId)
      }
    };
  }

  @Get("super-admin-check")
  @RequireRoles(UserRole.SUPER_ADMIN)
  @UseGuards(AuthRequiredGuard, RoleGuard)
  superAdminCheck(@Req() request: RequestWithAuthContext) {
    return {
      authorized: true,
      roleGuardPassed: true,
      requiredRole: UserRole.SUPER_ADMIN,
      role: request.auth?.role,
      backendOwned: true,
      lane: "DINAGAT-PASS-AUTH-CONTEXT-CAPABILITY-GUARDS-01"
    };
  }

  @Get("capability-check")
  @RequireCapabilities("AUTH_CONTEXT_VERIFY")
  @UseGuards(AuthRequiredGuard, CapabilityGuard)
  capabilityCheck(@Req() request: RequestWithAuthContext) {
    return {
      authorized: true,
      capabilityGuardPassed: true,
      requiredCapability: "AUTH_CONTEXT_VERIFY",
      superAdminBypass: request.auth?.capabilityBypass === true,
      backendOwned: true,
      lane: "DINAGAT-PASS-AUTH-CONTEXT-CAPABILITY-GUARDS-01"
    };
  }

  @Post("revoke")
  revokeSession(@Headers("authorization") authorization?: string) {
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : "";

    return this.authService.revokeSession(token, "Local auth hardening verification revocation.");
  }

  private assertFoundationEndpointAllowed(): void {
    const appEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? "local").toLowerCase();

    if (appEnv === "production" || appEnv === "prod") {
      throw new ForbiddenException("Internal auth foundation endpoints are disabled in production.");
    }
  }

  private requireEmail(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException("email is required.");
    }

    return value.trim();
  }

  private requirePassword(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException("password is required.");
    }

    return value;
  }

  private requireUserRole(role: UserRole | undefined): UserRole {
    if (!role || !Object.values(UserRole).includes(role)) {
      throw new BadRequestException("Valid role is required.");
    }

    return role;
  }
}
