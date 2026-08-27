import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Gmail / Email is required" },
        { status: 400 }
      );
    }

    // 1. Check if user exists with entered Gmail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this Gmail address ❌" },
        { status: 404 }
      );
    }

    // 2. Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Testing Link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Server console par link print hoga
    console.log("==========================================");
    console.log("PASSWORD RESET LINK FOR:", email);
    console.log(resetLink);
    console.log("==========================================");

    return NextResponse.json(
      {
        message: "Reset link generated successfully!",
        resetLink: resetLink, // Direct UI testing ke liye link response mein bhej rahe hain
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}