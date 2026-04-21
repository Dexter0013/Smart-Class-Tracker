import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createJWT, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface RegisterRequest {
  username: string;
  password: string;
  rollNo: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { username, password, rollNo, email } = body;

    if (!username || !password || !rollNo || !email) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 400 },
      );
    }

    // Check if student exists with this roll number
    const existingStudent = await prisma.student.findUnique({
      where: { rollNo },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: "Roll number not found in the system" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and link to student
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        email,
        role: "STUDENT",
        student: {
          connect: { id: existingStudent.id },
        },
      },
      include: { student: true },
    });

    // Create JWT token
    const token = await createJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Set secure HTTP-only cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
