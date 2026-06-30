import { NextResponse } from "next/server";

const DINAGAT_SESSION_COOKIE = "dinagat_session";
const DEFAULT_BACKEND_URL = "http://127.0.0.1:4000";

function getBackendBaseUrl(): string {
  const configuredBackendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.DINAGAT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.BACKEND_URL?.trim();

  return (configuredBackendUrl || DEFAULT_BACKEND_URL).replace(
    /\/$/,
    "",
  );
}

function getSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (
    !cookieHeader?.includes(
      `${DINAGAT_SESSION_COOKIE}=`,
    )
  ) {
    return null;
  }

  return cookieHeader;
}

export async function GET(request: Request) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.json(
      {
        success: false,
        authority: "backend-required",
        message: "Backend traveler session is required.",
      },
      {
        status: 401,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${getBackendBaseUrl()}/trip-bookings/intents/mine`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          cookie: sessionCookie,
        },
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        authority: "backend-required",
        backendUnavailable: true,
        message:
          "Backend traveler request service is unavailable.",
      },
      {
        status: 502,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  const responseBody = await backendResponse.text();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ??
        "application/json",
      "cache-control": "no-store",
    },
  });
}
