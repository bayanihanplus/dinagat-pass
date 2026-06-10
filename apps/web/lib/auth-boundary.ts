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
  lane: "DINAGAT-PASS-WEB-AUTH-BOUNDARY-FOUNDATION-01"
} as const;

export const protectedTravelerRoutes = ["/traveler/home"] as const;

export function isProtectedTravelerPath(pathname: string): boolean {
  return protectedTravelerRoutes.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function getReturningLoginPath(): string {
  return "/login?mode=returning&reason=auth-required";
}
