import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { recordId, status } = body;

    if (!recordId || !status) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const updated = await prisma.attendanceRecord.update({
      where: { id: recordId },
      data: { status },
      include: {
        student: { select: { id: true, name: true, rollNo: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
