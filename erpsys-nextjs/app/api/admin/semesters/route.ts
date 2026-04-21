import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const semesters = await prisma.semester.findMany({
      orderBy: { semesterName: "asc" },
    });

    return NextResponse.json(semesters);
  } catch (error) {
    return adminFailure("Failed to fetch semesters");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const body = await req.json();
    const { semesterName, startDate, endDate } = body;

    const semester = await prisma.semester.create({
      data: {
        semesterName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(semester, { status: 201 });
  } catch (error) {
    console.error("Error creating semester:", error);
    return adminFailure("Failed to create semester");
  }
}
