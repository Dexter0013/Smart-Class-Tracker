import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const semesters = await prisma.semester.findMany({
      orderBy: { semesterName: "asc" },
    });

    return NextResponse.json(semesters);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch semesters" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    return NextResponse.json({ error: "Failed to create semester" }, { status: 500 });
  }
}
