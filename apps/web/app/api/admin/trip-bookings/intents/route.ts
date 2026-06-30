import { NextResponse } from "next/server";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

function getBackendBaseUrl(): string {
  const configuredBackendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (configuredBackendUrl) {
    return configuredBackendUrl.replace(/\/$/, "");
  }

  return "http://127.0.0.1:4000";
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
        message: "Backend admin session is required.",
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
      `${getBackendBaseUrl()}/admin/trip-bookings/intents`,
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
          "Backend request-list service is unavailable.",
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
