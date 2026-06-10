import { NextResponse } from "next/server";
import { DINAGAT_AUTH_BOUNDARY } from "../../../../lib/auth-boundary";

export function GET() {
  return NextResponse.json({
    authenticated: false,
    authority: "backend",
    frontendOwnsAuthority: false,
    sessionCookieExpected: "dinagat_session",
    note: "Frontend auth boundary is prepared, but backend login/session issuing is not implemented yet.",
    boundary: DINAGAT_AUTH_BOUNDARY
  });
}
