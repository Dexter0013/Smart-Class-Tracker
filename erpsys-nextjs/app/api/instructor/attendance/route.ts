import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const instructor = await prisma.instructor.findUnique({
      where: { userId: user.userId },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    const classId = request.nextUrl.searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { message: "classId required" },
        { status: 400 }
      );
    }

    // Verify instructor owns this class
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classRecord || classRecord.instructorId !== instructor.id) {
      return NextResponse.json(
        { message: "Forbidden - this class is not yours" },
        { status: 403 }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: { classId },
      include: {
        records: {
          include: { student: { select: { id: true, name: true, rollNo: true } } },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { classId, date, subject, records } = body;

    if (!classId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Delete existing attendance for this class and date to allow upsert-like behavior
    const parsedDate = new Date(date);
    const existing = await prisma.attendance.findFirst({
      where: {
        classId,
        date: parsedDate,
      },
    });

    if (existing) {
      await prisma.attendance.delete({ where: { id: existing.id } });
    }

    const attendance = await prisma.attendance.create({
      data: {
        classId,
        date: parsedDate,
        subject,
        records: {
          create: records.map((record: any) => ({
            studentId: record.studentId,
            status: record.status || "PRESENT",
          })),
        },
      },
      include: {
        records: {
          include: { student: { select: { id: true, name: true, rollNo: true } } },
        },
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    console.error("Error creating attendance:", error);
    require("fs").appendFileSync(
      "attendance_error.log", 
      new Date().toISOString() + " - " + (error.stack || error.message || String(error)) + "\n"
    );
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
