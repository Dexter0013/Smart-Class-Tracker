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

    const department = await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error deleting department:", error);
    return adminFailure("Failed to delete department");
  }
}
