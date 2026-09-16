import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. If logged in and trying to access login/signup -> Redirect based on role
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(role === "ADMIN" ? "/dashboard" : "/profile", request.url)
    );
  }

  // 2. Routes that require login
  const protectedRoutes = [
    "/dashboard",
    "/admin",
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

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Employee-only exception: allow /employees/:id (their own detail page)
  const isEmployeeDetailPage =
    pathname.startsWith("/employees/") && pathname !== "/employees";

  // 4. If logged in but NOT an admin -> block admin-only routes
  if (token && role !== "ADMIN") {
    const adminOnlyRoutes = [
      "/dashboard",
      "/admin",
      "/employees", // covers the LIST page "/employees" exactly
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
    "/dashboard/:path*",
    "/admin/:path*",
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