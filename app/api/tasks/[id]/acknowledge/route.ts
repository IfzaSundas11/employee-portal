import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
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