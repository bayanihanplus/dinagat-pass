import { NextResponse, type NextRequest } from "next/server";
import {
  getProtectedRouteRoleRule,
  getReturningLoginPath,
  getUnauthorizedRolePath,
  isDinagatUserRole,
  isProtectedTravelerPath,
  type DinagatUserRole,
} from "./lib/auth-boundary";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

type BackendAuthMeResponse = {
  authenticated?: boolean;
  authority?: string;
  frontendOwnsAuthority?: boolean;
  user?: {
    role?: string;
  } | null;
};

type BackendSessionValidationResult =
  | {
      valid: true;
      role: DinagatUserRole;
    }
  | {
      valid: false;
      role: null;
    };

function getBackendBaseUrl(request: NextRequest): string {
  const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (configuredBackendUrl) {
    return configuredBackendUrl.replace(/\/$/, "");
  }

  if (request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1") {
    return "http://127.0.0.1:4000";
  }

  return request.nextUrl.origin;
}

async function validateBackendSession(request: NextRequest): Promise<BackendSessionValidationResult> {
  const sessionCookie = request.cookies.get(DINAGAT_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return {
      valid: false,
      role: null,
    };
  }

  const backendBaseUrl = getBackendBaseUrl(request);
  const authMeUrl = `${backendBaseUrl}/auth/me`;

  try {
    const response = await fetch(authMeUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        cookie: `${DINAGAT_SESSION_COOKIE}=${sessionCookie}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        valid: false,
        role: null,
      };
    }

    const authMe = (await response.json()) as BackendAuthMeResponse;
    const role = authMe.user?.role;

    if (
      authMe.authenticated === true &&
      authMe.authority === "backend" &&
      authMe.frontendOwnsAuthority === false &&
      isDinagatUserRole(role)
    ) {
      return {
        valid: true,
        role,
      };
    }

    return {
      valid: false,
      role: null,
    };
  } catch {
    return {
      valid: false,
      role: null,
    };
  }
}

function redirectToReturningLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(getReturningLoginPath(), request.url));
  response.cookies.delete(DINAGAT_SESSION_COOKIE);
  return response;
}

function redirectToRoleRequired(request: NextRequest, redirectPath: string): NextResponse {
  const response = NextResponse.redirect(new URL(redirectPath || getUnauthorizedRolePath(), request.url));
  return response;
}

function isRoleAllowed(role: DinagatUserRole, allowedRoles: readonly DinagatUserRole[]): boolean {
  return allowedRoles.includes(role);
}

function isProtectedAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

const ADMIN_ROUTE_ALLOWED_ROLES = ["ADMIN", "SUPER_ADMIN"] as const satisfies readonly DinagatUserRole[];

// DINAGAT PASS ADMIN ROUTE PROTECTION

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedAdminRoute = isProtectedAdminPath(pathname);

  if (!isProtectedTravelerPath(pathname) && !isProtectedAdminRoute) {
    return NextResponse.next();
  }

  const backendSession = await validateBackendSession(request);

  if (!backendSession.valid) {
    return redirectToReturningLogin(request);
  }

  const roleRule = isProtectedAdminRoute
    ? {
        allowedRoles: ADMIN_ROUTE_ALLOWED_ROLES,
        unauthorizedRedirectPath: getUnauthorizedRolePath(),
      }
    : getProtectedRouteRoleRule(pathname);

  if (roleRule && !isRoleAllowed(backendSession.role, roleRule.allowedRoles)) {
    return redirectToRoleRequired(request, roleRule.unauthorizedRedirectPath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/traveler/:path*", "/admin/:path*"],
};