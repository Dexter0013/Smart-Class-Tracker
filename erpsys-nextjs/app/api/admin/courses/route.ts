import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const courses = await prisma.course.findMany({
      include: { department: true },
      orderBy: { courseCode: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return adminFailure("Failed to fetch courses");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const body = await req.json();
    const { courseCode, courseName, credits, departmentId } = body;

    if (!courseCode || !courseName || !departmentId) {
      return adminFailure("Missing required fields", 400);
    }

    const course = await prisma.course.create({
      data: {
        courseCode,
        courseName,
        credits: parseInt(credits) || 3,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error.code === "P2002") {
      return adminFailure("Course code already exists", 400);
    }
    return adminFailure("Failed to create course");
  }
}
