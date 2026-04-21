import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const { id } = await params;

    // Delete the student first
    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    if (error.code === "P2025") {
      return adminFailure("Student not found", 404);
    }
    return adminFailure("Failed to delete student");
  }
}
