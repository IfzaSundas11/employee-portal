import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_token")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let employeeId: string | null = null;

    if (role !== "ADMIN") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user) {
        const employee = await prisma.employee.findUnique({
          where: { email: user.email },
          select: { id: true },
        });
        employeeId = employee?.id || null;
      }
    }

    return NextResponse.json({ role, employeeId }, { status: 200 });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}