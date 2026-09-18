import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    return NextResponse.json(
      { id, status, message: "Leave requests are not configured in the current Prisma schema." },
      { status: 501 }
    );
  } catch (error) {
    console.error("PATCH Leave Error:", error);
    return NextResponse.json({ error: "Status update nahi ho saka" }, { status: 500 });
  }
}