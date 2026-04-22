import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveInstructorApiContext } from "@/lib/instructor-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const classes = await prisma.class.findMany({
      where: { instructorId: context.instructorId },
      include: {
        course: true,
        semester: true,
        _count: {
          select: { enrollments: true, assessments: true },
        },
      },
      orderBy: { semester: { startDate: "desc" } },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Failed to fetch instructor classes:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
