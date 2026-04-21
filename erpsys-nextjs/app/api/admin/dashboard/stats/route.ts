import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveAdminApiContext } from "@/lib/admin-api-context";

export async function GET(request: NextRequest) {
  try {
    const context = await resolveAdminApiContext(request, "success");
    if (!context.ok) {
      return context.response;
    }

    const [studentCount, courseCount, instructorCount, departmentCount] =
      await Promise.all([
        prisma.student.count(),
        prisma.course.count(),
        prisma.instructor.count(),
        prisma.department.count(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        studentCount,
        courseCount,
        instructorCount,
        departmentCount,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
