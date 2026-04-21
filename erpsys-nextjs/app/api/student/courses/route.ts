import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveStudentApiContext } from "@/lib/student-api-context";

export async function GET(_request: NextRequest) {
  try {
    const context = await resolveStudentApiContext();
    if (!context.ok) {
      return context.response;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: context.studentId },
      include: {
        class: {
          include: {
            course: true,
            instructor: true,
            semester: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        courseCode: enrollment.class.course.courseCode,
        courseName: enrollment.class.course.courseName,
        credits: enrollment.class.course.credits,
        instructor: enrollment.class.instructor.name,
        schedule: enrollment.class.schedule,
        location: enrollment.class.location,
        semester: enrollment.class.semester.semesterName,
        finalGrade: enrollment.finalGrade,
      })),
    });
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
