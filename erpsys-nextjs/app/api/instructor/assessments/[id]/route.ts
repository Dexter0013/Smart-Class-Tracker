import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveInstructorApiContext } from "@/lib/instructor-api-context";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await resolveInstructorApiContext();
    if (!context.ok) return context.response;

    const { id } = await params;

    // Verify ownership
    const owned = await prisma.assessment.findFirst({
      where: { id, class: { instructorId: context.instructorId } },
    });

    if (!owned) {
      return NextResponse.json({ success: false, message: "Unauthorized delete request" }, { status: 401 });
    }

    await prisma.assessment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
