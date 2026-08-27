import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, firstName, lastName, phone, email, password } = body;

    // Phone condition is removed from backend validation check
    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Username, First Name, Last Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        phone: phone || null, // Optional handling
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Staff account created successfully!",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Register API route is active. Please submit registration via POST request." },
    { status: 200 }
  );
}