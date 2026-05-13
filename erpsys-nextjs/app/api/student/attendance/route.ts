import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.userId },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const attendance = await prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
      include: {
        attendance: {
          include: {
            class: {
              include: {
                course: { select: { courseCode: true, courseName: true } },
                semester: { select: { semesterName: true } },
              },
            },
          },
        },
      },
      orderBy: { attendance: { date: "desc" } },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
