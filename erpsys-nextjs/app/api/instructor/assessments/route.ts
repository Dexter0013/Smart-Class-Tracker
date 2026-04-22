import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveInstructorApiContext } from "@/lib/instructor-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const assessments = await prisma.assessment.findMany({
      where: { class: { instructorId: context.instructorId } },
      include: {
        class: { include: { course: true, semester: true } },
        _count: { select: { marks: true } },
      },
      orderBy: { assessmentDate: "desc" },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Failed to fetch instructor assessments:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const body = await request.json();
    const { classId, assessmentName, maxMarks, assessmentDate } = body;

    if (!classId || !assessmentName || !maxMarks) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Verify instructor owns the class they are making an assessment for
    const owned = await prisma.class.findFirst({
      where: { id: classId, instructorId: context.instructorId },
    });

    if (!owned) {
      return NextResponse.json({ success: false, message: "Unauthorized: Class not assigned to you" }, { status: 401 });
    }

    const newAssessment = await prisma.assessment.create({
      data: {
        classId,
        assessmentName,
        maxMarks: parseInt(maxMarks),
        assessmentDate: assessmentDate ? new Date(assessmentDate) : null,
      },
    });

    return NextResponse.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error("Failed to create assessment:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
