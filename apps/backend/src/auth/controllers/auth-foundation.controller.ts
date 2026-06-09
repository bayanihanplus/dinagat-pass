import { Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { RequireCapabilities, RequireRoles } from "../decorators";
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
    return this.authService.getAuthReadiness();
  }

  @Post("credential")
  createCredential(@Body() body: LocalCreateCredentialBody) {
    return this.authService.createCredential({
      email: body.email ?? "admin.placeholder@dinagat-pass.local",
      displayName: body.displayName ?? "Dinagat Pass Admin Placeholder",
      role: body.role ?? UserRole.SUPER_ADMIN,
      password: body.password ?? "ReplaceThisLocalPassword123!",
      isActive: body.isActive ?? false
    });
  }

  @Post("session")
  createSession(@Body() body: LocalCreateSessionBody) {
    return this.authService.createSession({
      email: body.email ?? "admin.placeholder@dinagat-pass.local",
      password: body.password ?? "ReplaceThisLocalPassword123!"
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
}
