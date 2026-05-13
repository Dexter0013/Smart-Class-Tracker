import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const classId = request.nextUrl.searchParams.get("classId");

    const attendance = await prisma.attendance.findMany({
      where: classId ? { classId } : {},
      include: {
        class: {
          include: {
            course: { select: { courseCode: true, courseName: true } },
            instructor: { select: { name: true } },
            semester: { select: { semesterName: true } },
          },
        },
        records: {
          include: { student: { select: { name: true, rollNo: true } } },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
