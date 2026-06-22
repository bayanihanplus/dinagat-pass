import { NextResponse } from "next/server";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

function getBackendBaseUrl(): string {
  const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (configuredBackendUrl) {
    return configuredBackendUrl.replace(/\/$/, "");
  }

  return "http://127.0.0.1:4000";
}

export async function POST(request: Request) {
  const backendBaseUrl = getBackendBaseUrl();
  const body = await request.text();

  const backendResponse = await fetch(`${backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
    body,
    cache: "no-store",
  });

  const responseBody = await backendResponse.text();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type": backendResponse.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });

  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie?.includes(`${DINAGAT_SESSION_COOKIE}=`)) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}