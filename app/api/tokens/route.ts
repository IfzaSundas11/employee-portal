import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET - Get all refresh tokens
export async function GET() {
  try {
    const tokens = await prisma.refreshToken.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}