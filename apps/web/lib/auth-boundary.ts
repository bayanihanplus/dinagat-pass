export const DINAGAT_AUTH_BOUNDARY = {
  product: "Dinagat Pass",
  backendOwned: true,
  frontendOwnsAuthority: false,
  publicSignupCreated: false,
  cookieIssuedByFrontend: false,
  jwtIssuedByFrontend: false,
  fakeDashboardAuthAllowed: false,
  loginUiCreated: true,
  protectedRoutePrepared: true,
  roleGatePrepared: true,
  lane: "DINAGAT-PASS-AUTH-SESSION-ROLE-GATE-FOUNDATION-01"
} as const;

export const DINAGAT_USER_ROLES = [
  "TRAVELER",
  "OPERATOR_OWNER",
  "OPERATOR_STAFF",
  "LGU_USER",
  "ADMIN",
  "SUPER_ADMIN"
] as const;

export type DinagatUserRole = (typeof DINAGAT_USER_ROLES)[number];

export const protectedTravelerRoutes = [
  "/traveler/home",
  "/traveler/requests",
] as const;

export const protectedRouteRoleRules = [
  {
    route: "/traveler/home",
    allowedRoles: ["TRAVELER", "SUPER_ADMIN"],
    surface: "traveler",
    unauthorizedRedirectPath: "/unauthorized?reason=role-required"
  },
  {
    route: "/traveler/requests",
    allowedRoles: ["TRAVELER"],
    surface: "traveler",
    unauthorizedRedirectPath: "/unauthorized?reason=role-required"
  }
] as const satisfies ReadonlyArray<{
  route: string;
  allowedRoles: readonly DinagatUserRole[];
  surface: "traveler" | "operator" | "lgu" | "admin";
  unauthorizedRedirectPath: string;
}>;

export type ProtectedRouteRoleRule = (typeof protectedRouteRoleRules)[number];

export function isDinagatUserRole(value: string | undefined): value is DinagatUserRole {
  return DINAGAT_USER_ROLES.includes(value as DinagatUserRole);
}

export function getProtectedRouteRoleRule(pathname: string): ProtectedRouteRoleRule | null {
  return (
    protectedRouteRoleRules.find((rule) => {
      return pathname === rule.route || pathname.startsWith(`${rule.route}/`);
    }) ?? null
  );
}

export function isProtectedTravelerPath(pathname: string): boolean {
  return (
    pathname === "/traveler/home" ||
    pathname === "/traveler/pass" ||
    pathname === "/traveler/trip-booking" ||
    pathname === "/traveler/requests" ||
    pathname.startsWith("/traveler/requests/") ||
    pathname === "/traveler/settings"
  );
}

export function getReturningLoginPath(): string {
  return "/login?mode=returning&reason=auth-required";
}

export function getUnauthorizedRolePath(): string {
  return "/unauthorized?reason=role-required";
}
