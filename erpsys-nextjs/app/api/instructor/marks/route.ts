import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveInstructorApiContext } from "@/lib/instructor-api-context";

export async function GET(request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");

    if (!assessmentId) {
      return NextResponse.json({ success: false, message: "assessmentId Query Params required" }, { status: 400 });
    }

    // Enforce ownership
    const owned = await prisma.assessment.findFirst({
      where: { id: assessmentId, class: { instructorId: context.instructorId } },
    });

    if (!owned) {
      return NextResponse.json({ success: false, message: "Unauthorized access to this assessment" }, { status: 401 });
    }

    const marks = await prisma.studentMark.findMany({
      where: { assessmentId },
      include: {
        student: { select: { id: true, name: true, rollNo: true } },
      },
    });

    return NextResponse.json(marks);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const { assessmentId, studentId, marksObtained } = await request.json();

    if (!assessmentId || !studentId || marksObtained === undefined) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Verify ownership
    const owned = await prisma.assessment.findFirst({
      where: { id: assessmentId, class: { instructorId: context.instructorId } },
    });

    if (!owned) {
      return NextResponse.json({ success: false, message: "Unauthorized assignment of marks" }, { status: 401 });
    }

    // Upsert mechanism (creates if not exists, updates if exists)
    const upserted = await prisma.studentMark.upsert({
      where: {
        studentId_assessmentId: { studentId, assessmentId },
      },
      update: { marksObtained: parseFloat(marksObtained) },
      create: {
        studentId,
        assessmentId,
        marksObtained: parseFloat(marksObtained),
      },
    });

    return NextResponse.json({ success: true, data: upserted });
  } catch (error) {
    console.error("Mark upsert fail:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
