import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  resolveAdminApiContext,
  resolveAdminTableModel,
} from "@/lib/admin-api-context";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(request, "success");
    if (!context.ok) {
      return context.response;
    }

    const { table, id } = await params;
    const modelResult = resolveAdminTableModel(table);
    if (!modelResult.ok) {
      return modelResult.response;
    }
    const { model } = modelResult;

    const body = await request.json();

    const data = await (prisma[model] as any).update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("CRUD update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> },
) {
  try {
    const context = await resolveAdminApiContext(_request, "success");
    if (!context.ok) {
      return context.response;
    }

    const { table, id } = await params;
    const modelResult = resolveAdminTableModel(table);
    if (!modelResult.ok) {
      return modelResult.response;
    }
    const { model } = modelResult;

    await (prisma[model] as any).delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("CRUD delete error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
