import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveAdminApiContext, adminFailure } from "@/lib/admin-api-context";
import bcrypt from "bcryptjs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const { id } = await params;
    const body = await req.json();
    const { username, email, password, role } = body;

    const updateData: any = { username, email, role };

    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      return adminFailure("Username or Email already exists", 400);
    }
    return adminFailure("Failed to update user");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return adminFailure("Failed to delete user. Please ensure there are no tied Student/Instructor models.");
  }
}
