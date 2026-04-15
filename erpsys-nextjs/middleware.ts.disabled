import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;

  // Public routes that don't need auth
  const publicRoutes = ["/admin/login", "/student/login", "/student/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname === route
  );

  // If accessing public routes, allow
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = ["/admin", "/student"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to appropriate login page
      const loginPath = request.nextUrl.pathname.startsWith("/admin")
        ? "/admin/login"
        : "/student/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Verify token
    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check role-based access
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/student")) {
      if (user.role !== "STUDENT") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
