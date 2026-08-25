import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required ❌" }, 
        { status: 400 }
      );
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email not found ❌" }, 
        { status: 404 }
      );
    }

    // Generate reset token (Testing / Simulation)
    const resetToken = Math.random().toString(36).substring(2, 15);

    // Development terminal log to test reset link
    console.log(`Password reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { message: "Reset link sent successfully! 📩", token: resetToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Failed to process request ⚠️" }, 
      { status: 500 }
    );
  }
}