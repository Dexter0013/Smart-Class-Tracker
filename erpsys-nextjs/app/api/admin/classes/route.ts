import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const classes = await prisma.class.findMany({
      include: {
        course: true,
        instructor: true,
        semester: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    return adminFailure("Failed to fetch classes");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const body = await req.json();
    const { courseId, instructorId, semesterId, location, schedule } = body;

    const newClass = await prisma.class.create({
      data: {
        courseId,
        instructorId,
        semesterId,
        location,
        schedule,
      },
      include: {
        course: true,
        instructor: true,
        semester: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return adminFailure("Failed to create class");
  }
}
