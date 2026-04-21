import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveStudentApiContext } from "@/lib/student-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveStudentApiContext();
    if (!context.ok) {
      return context.response;
    }

    const marks = await prisma.studentMark.findMany({
      where: { studentId: context.studentId },
      include: {
        assessment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: marks.map((mark) => ({
        courseCode: mark.assessment.class.course.courseCode,
        courseName: mark.assessment.class.course.courseName,
        assessmentName: mark.assessment.assessmentName,
        marksObtained: mark.marksObtained,
        maxMarks: mark.assessment.maxMarks,
        percentage: (
          (mark.marksObtained / mark.assessment.maxMarks) *
          100
        ).toFixed(2),
        status:
          mark.marksObtained >= mark.assessment.maxMarks * 0.5
            ? "Pass"
            : "Fail",
      })),
    });
  } catch (error) {
    console.error("Grades fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
