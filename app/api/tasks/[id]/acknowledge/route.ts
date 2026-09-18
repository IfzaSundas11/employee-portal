import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Task acknowledged successfully!", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to acknowledge task" },
      { status: 500 }
    );
  }
}