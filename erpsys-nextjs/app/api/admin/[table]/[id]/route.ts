import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  resolveAdminApiContext,
  resolveAdminTableModel,
} from "@/lib/admin-api-context";
import { adminDynamicIncludes } from "@/lib/admin-dynamic-config";
import { getZodSchemaForTable } from "@/lib/validations";
import { z } from "zod";

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

    const rawBody = await request.json();
    
    const schema = getZodSchemaForTable(table);
    const parsedBody = schema.parse(rawBody);

    const data = await (prisma[model] as any).update({
      where: { id },
      data: parsedBody,
      include: adminDynamicIncludes[model] || undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`CRUD ${await params.then(p=>p.table)} update error:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Unique constraint failed. Record already exists." },
        { status: 400 }
      );
    }
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`CRUD ${await params.then(p=>p.table)} delete error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
