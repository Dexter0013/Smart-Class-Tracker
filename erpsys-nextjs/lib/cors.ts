import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

export function getCORSHeaders(origin?: string | null) {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);

  if (!isAllowed) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCORSPreflight(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin");
    const headers = getCORSHeaders(origin);

    if (Object.keys(headers).length === 0) {
      return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, {
      status: 200,
      headers,
    });
  }

  return null;
}
