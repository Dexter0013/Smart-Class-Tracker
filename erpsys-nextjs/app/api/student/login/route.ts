import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createJWT } from "@/lib/auth";
import { LoginResponse } from "@/lib/types";
import { LoginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponse>> {
  try {
    const rawBody = await request.json();
    const parsed = LoginSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 },
      );
    }
    const { username, password } = parsed.data;

    // Find student user
    const user = await prisma.user.findUnique({
      where: { username },
      include: { student: true },
    });

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      // Fallback for plaintext passwords from old system
      if (password !== user.passwordHash) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 },
        );
      }
    }

    // Create JWT token
    const token = await createJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // Set secure HTTP-only cookie
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
