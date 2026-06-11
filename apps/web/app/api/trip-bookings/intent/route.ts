import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

function getBackendBaseUrl(): string {
  const value =
    process.env.DINAGAT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    DEFAULT_BACKEND_URL;

  return value.replace(/\/$/, '');
}

function getForwardedCookie(request: NextRequest): string {
  return request.headers.get('cookie') || '';
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Invalid booking request.',
      },
      { status: 400 },
    );
  }

  const backendUrl = `${getBackendBaseUrl()}/trip-bookings/intent`;

  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: getForwardedCookie(request),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await response.text();

  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {
      ok: false,
      message: text || 'Backend booking service returned a non-JSON response.',
    };
  }

  return NextResponse.json(data, { status: response.status });
}
