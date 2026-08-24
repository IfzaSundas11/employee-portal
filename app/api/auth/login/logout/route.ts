import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the accessToken cookie by setting it to empty and expiring it
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry to past date to delete cookie
    path: "/",
  });

  return response;
}