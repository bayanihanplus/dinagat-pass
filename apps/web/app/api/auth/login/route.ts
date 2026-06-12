import { NextRequest, NextResponse } from "next/server";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

type BackendLoginBody = {
  email?: unknown;
  password?: unknown;
};

function getBackendBaseUrl(): string {
  const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (configuredBackendUrl) {
    return configuredBackendUrl.replace(/\/$/, "");
  }

  return "http://127.0.0.1:4000";
}

function requireCredential(value: unknown, label: "email" | "password"): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required.`);
  }

  return label === "email" ? value.trim().toLowerCase() : value;
}

export async function POST(request: NextRequest) {
  let body: BackendLoginBody;

  try {
    body = (await request.json()) as BackendLoginBody;
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        authority: "backend",
        frontendOwnsAuthority: false,
        error: "Invalid login payload."
      },
      { status: 400 }
    );
  }

  let email: string;
  let password: string;

  try {
    email = requireCredential(body.email, "email");
    password = requireCredential(body.password, "password");
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        authority: "backend",
        frontendOwnsAuthority: false,
        error: error instanceof Error ? error.message : "Credentials are required."
      },
      { status: 400 }
    );
  }

  const backendBaseUrl = getBackendBaseUrl();
  const backendResponse = await fetch(`${backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    }),
    cache: "no-store"
  });

  const payload = await backendResponse.json().catch(() => ({
    authenticated: false,
    authority: "backend",
    frontendOwnsAuthority: false,
    error: "Backend login returned an unreadable response."
  }));

  const response = NextResponse.json(payload, {
    status: backendResponse.status
  });

  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie?.includes(`${DINAGAT_SESSION_COOKIE}=`)) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
