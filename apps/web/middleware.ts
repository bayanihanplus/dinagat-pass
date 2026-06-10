import { NextResponse, type NextRequest } from "next/server";
import { getReturningLoginPath, isProtectedTravelerPath } from "./lib/auth-boundary";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

type BackendAuthMeResponse = {
  authenticated?: boolean;
  authority?: string;
  frontendOwnsAuthority?: boolean;
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

async function validateBackendSession(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(DINAGAT_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return false;
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
      return false;
    }

    const authMe = (await response.json()) as BackendAuthMeResponse;

    return (
      authMe.authenticated === true &&
      authMe.authority === "backend" &&
      authMe.frontendOwnsAuthority === false
    );
  } catch {
    return false;
  }
}

function redirectToReturningLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(getReturningLoginPath(), request.url));
  response.cookies.delete(DINAGAT_SESSION_COOKIE);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedTravelerPath(pathname)) {
    return NextResponse.next();
  }

  const backendSessionValid = await validateBackendSession(request);

  if (!backendSessionValid) {
    return redirectToReturningLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/traveler/:path*"],
};
