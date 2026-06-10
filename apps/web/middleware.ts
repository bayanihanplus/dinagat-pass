import { NextResponse, type NextRequest } from "next/server";
import { getReturningLoginPath, isProtectedTravelerPath } from "./lib/auth-boundary";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedTravelerPath(pathname)) {
    return NextResponse.next();
  }

  const hasBackendSessionCookie = Boolean(request.cookies.get("dinagat_session")?.value);

  if (!hasBackendSessionCookie) {
    const loginUrl = new URL(getReturningLoginPath(), request.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/traveler/:path*"]
};
