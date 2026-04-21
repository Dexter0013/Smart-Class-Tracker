import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const instructors = await prisma.instructor.findMany({
      include: { department: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    return adminFailure("Failed to fetch instructors");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

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
    return adminFailure("Failed to create instructor");
  }
}
