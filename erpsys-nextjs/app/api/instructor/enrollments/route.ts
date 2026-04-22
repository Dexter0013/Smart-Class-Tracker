import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveInstructorApiContext } from "@/lib/instructor-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const enrollments = await prisma.enrollment.findMany({
      where: { class: { instructorId: context.instructorId } },
      include: {
        student: true,
        class: {
          include: {
            course: true,
            semester: true,
          },
        },
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Failed to fetch instructor enrollments:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const { enrollmentId, finalGrade } = await request.json();
    if (!enrollmentId || !finalGrade) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Verify the instructor owns this enrollment's class
    const owned = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, class: { instructorId: context.instructorId } },
    });

    if (!owned) {
      return NextResponse.json({ success: false, message: "Unauthorized to grade this student" }, { status: 401 });
    }

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { finalGrade },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update grade:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
