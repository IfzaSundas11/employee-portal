import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([], { status: 200 });
}

export async function POST() {
  return NextResponse.json(
    { error: "Leave requests are not configured in the current Prisma schema." },
    { status: 501 }
  );
}