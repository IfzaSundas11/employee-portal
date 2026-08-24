import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If protected route and no token → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already logged in and visiting login → redirect to dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};