import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const students = await prisma.student.findMany({
      include: { department: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    return adminFailure("Failed to fetch students");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const body = await req.json();
    const { name, rollNo, email, phone, departmentId, username, password } =
      body;

    if (!name || !rollNo || !email || !departmentId || !username || !password) {
      return adminFailure("Missing required fields", 400);
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "STUDENT",
      },
    });

    // Create student
    const student = await prisma.student.create({
      data: {
        userId: newUser.id,
        name,
        rollNo,
        email,
        phone,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.code === "P2002") {
      return adminFailure("Username or email already exists", 400);
    }
    return adminFailure("Failed to create student");
  }
}
