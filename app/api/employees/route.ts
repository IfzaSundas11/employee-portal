import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/auditLog";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { department: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address, designation, joiningDate, status, departmentId } = body;

    if (!name || !email || !designation || !joiningDate || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        designation,
        joiningDate: new Date(joiningDate),
        status: status || "Active",
        departmentId,
      },
      include: { department: true },
    });

    // Audit Log Record
    await createAuditLog(
      "EMPLOYEE_CREATED",
      `Admin added new employee "${employee.name}" to ${employee.department?.name || "a department"}`,
      "Admin"
    );

    return NextResponse.json(employee, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}