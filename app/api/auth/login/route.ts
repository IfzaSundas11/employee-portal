import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", user); // ← YEH NAYA HAI

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isPasswordValid = await compare(password, user.passwordHash);

    console.log("Password valid:", isPasswordValid); // ← YEH BHI NAYA HAI

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Generate JWT Token using 'jose'
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-super-secret-key"
    );

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // 4. Create Response & Set HTTP-only Cookie
    const response = NextResponse.json(
      { message: "Login successful", user: { email: user.email, role: user.role } },
      { status: 200 }
    );

    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}