import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.searchParams.get("date");

    const where = dateParam
      ? {
          date: {
            gte: new Date(dateParam + "T00:00:00.000Z"),
            lt: new Date(dateParam + "T23:59:59.999Z"),
          },
        }
      : {};

    const records = await prisma.attendance.findMany({
      where,
      include: { employee: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(records);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, action } = body;

    if (!employeeId || !action) {
      return NextResponse.json(
        { error: "employeeId and action are required" },
        { status: 400 }
      );
    }

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const dateOnly = new Date(y + "-" + m + "-" + d + "T00:00:00.000Z");

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: dateOnly,
        },
      },
    });

    if (action === "check-in") {
      if (existing) {
        return NextResponse.json(
          { error: "Already checked in today" },
          { status: 409 }
        );
      }

      const record = await prisma.attendance.create({
        data: {
          employeeId,
          date: dateOnly,
          checkIn: new Date(),
          status: "Present",
        },
        include: { employee: true },
      });

      return NextResponse.json(record, { status: 201 });
    }

    if (action === "check-out") {
      if (!existing) {
        return NextResponse.json(
          { error: "You must check in first" },
          { status: 400 }
        );
      }

      const record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { checkOut: new Date() },
        include: { employee: true },
      });

      return NextResponse.json(record);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}