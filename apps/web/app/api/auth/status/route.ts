import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "http://127.0.0.1:4000";

function getBackendBaseUrl(): string {
  const configuredBackendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.DINAGAT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.BACKEND_URL?.trim();

  return (configuredBackendUrl || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function GET(request: NextRequest) {
  const backendBaseUrl = getBackendBaseUrl();
  const cookie = request.headers.get("cookie") || "";

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${backendBaseUrl}/auth/me`, {
      method: "GET",
      headers: {
        accept: "application/json",
        cookie,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        authority: "backend-required",
        frontendOwnsAuthority: false,
        backendUnavailable: true,
        user: null,
        message: "Backend authentication service is unavailable.",
      },
      {
        status: 502,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  const responseText = await backendResponse.text();

  let responseBody: unknown;

  try {
    responseBody = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseBody = {
      authenticated: false,
      authority: "backend",
      frontendOwnsAuthority: false,
      user: null,
      message: "Backend authentication service returned an invalid response.",
    };
  }

  return NextResponse.json(responseBody, {
    status: backendResponse.status,
    headers: {
      "cache-control": "no-store",
    },
  });
}
