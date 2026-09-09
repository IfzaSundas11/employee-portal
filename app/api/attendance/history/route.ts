import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");
    const month = req.nextUrl.searchParams.get("month");

    if (!employeeId || !month) {
      return NextResponse.json(
        { error: "employeeId and month are required" },
        { status: 400 }
      );
    }

    const [year, monthNum] = month.split("-").map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDayToShow = endOfMonth < today ? endOfMonth : today;

    const records = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const recordsByDate: Record<string, any> = {};
    records.forEach(function (r) {
      const key = r.date.toISOString().split("T")[0];
      recordsByDate[key] = r;
    });

    const days = [];
    const cursor = new Date(startOfMonth);

    while (cursor <= lastDayToShow) {
      const dayOfWeek = cursor.getDay(); // 0 = Sunday, 6 = Saturday

      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const key = cursor.toISOString().split("T")[0];
        const record = recordsByDate[key];

        days.push({
          date: key,
          checkIn: record ? record.checkIn : null,
          checkOut: record ? record.checkOut : null,
          status: record ? record.status : "Absent",
        });
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    // Show most recent date first
    days.reverse();

    const presentCount = days.filter(function (d) { return d.status === "Present"; }).length;
    const absentCount = days.filter(function (d) { return d.status === "Absent"; }).length;

    return NextResponse.json({ days, presentCount, absentCount, totalDays: days.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch attendance history" },
      { status: 500 }
    );
  }
}