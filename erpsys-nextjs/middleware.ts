import { NextRequest, NextResponse } from "next/server";

// Allowed origins - whitelist only your domains
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = request.nextUrl.pathname;

  // Skip CORS checks for login and auth endpoints
  if (pathname.includes("/login") || pathname.includes("/auth/logout")) {
    return NextResponse.next();
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin);
    if (!isAllowed) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // If it's a same-origin request (no origin header), allow it
  if (!origin) {
    return NextResponse.next();
  }

  // Check if origin is allowed
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  if (!isAllowed) {
    return NextResponse.json(
      { error: "CORS policy violation - unauthorized origin" },
      { status: 403 }
    );
  }

  // Allow the request and set CORS headers
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

// Match only API routes
export const config = {
  matcher: "/api/:path*",
};
