import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const instructors = await prisma.instructor.findMany({
      include: { department: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, email, phone, departmentId, username, password } = body;

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "INSTRUCTOR",
      },
    });

    // Create instructor
    const instructor = await prisma.instructor.create({
      data: {
        userId: newUser.id,
        name,
        email,
        phone,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(instructor, { status: 201 });
  } catch (error) {
    console.error("Error creating instructor:", error);
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 });
  }
}
