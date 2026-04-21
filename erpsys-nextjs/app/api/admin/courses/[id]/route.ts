import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const { id } = await params;
    const body = await req.json();
    const { courseCode, courseName, credits, departmentId } = body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        courseCode,
        courseName,
        credits: parseInt(credits) || 3,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Error updating course:", error);
    if (error.code === "P2025") {
      return adminFailure("Course not found", 404);
    }
    return adminFailure("Failed to update course");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const { id } = await params;

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    if (error.code === "P2025") {
      return adminFailure("Course not found", 404);
    }
    return adminFailure("Failed to delete course");
  }
}
