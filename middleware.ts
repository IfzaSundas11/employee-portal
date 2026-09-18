import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is authenticated and attempts to access authentication routes, redirect based on role
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(role === "ADMIN" ? "/dashboard" : "/profile", request.url)
    );
  }

  // 2. Define protected routes that require active authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/employees",
    "/departments",
    "/attendance",
    "/tasks",
    "/reports",
    "/audit",
    "/settings",
  ];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users attempting to access protected routes to login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Exception rule: Allow employees to view their specific detail route (/employees/:id)
  const isEmployeeDetailPage =
    pathname.startsWith("/employees/") && pathname !== "/employees";

  // 4. Restrict admin-only routes for non-admin roles
  if (token && role !== "ADMIN") {
    const adminOnlyRoutes = [
      "/dashboard",
      "/employees",
      "/departments",
      "/attendance",
      "/tasks",
      "/reports",
      "/audit",
      "/settings",
    ];

    const isAdminOnly =
      adminOnlyRoutes.some((route) => pathname.startsWith(route)) &&
      !isEmployeeDetailPage;

    if (isAdminOnly) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/tasks/:path*",
    "/reports/:path*",
    "/audit/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};