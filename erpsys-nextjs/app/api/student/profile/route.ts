import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveStudentApiContext } from "@/lib/student-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveStudentApiContext();
    if (!context.ok) {
      return context.response;
    }

    const student = await prisma.student.findUnique({
      where: { id: context.studentId },
      include: {
        department: true,
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
