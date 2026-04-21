import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  resolveAdminApiContext,
  resolveAdminTableModel,
} from "@/lib/admin-api-context";
import {
  adminDynamicIncludes,
  transformAdminBody,
} from "@/lib/admin-dynamic-config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  try {
    const context = await resolveAdminApiContext(request, "success");
    if (!context.ok) {
      return context.response;
    }

    const { table } = await params;
    const modelResult = resolveAdminTableModel(table);
    if (!modelResult.ok) {
      return modelResult.response;
    }
    const { model } = modelResult;

    let data = await (prisma[model] as any).findMany({
      take: 100,
      include: adminDynamicIncludes[model] || undefined,
    });

    if (model === "user") {
      data = data.map((item: any) => {
        const { passwordHash, ...safeItem } = item;
        return safeItem;
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`CRUD ${await params.then(p=>p.table)} read error:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  try {
    const context = await resolveAdminApiContext(request, "success");
    if (!context.ok) {
      return context.response;
    }

    const { table } = await params;
    const modelResult = resolveAdminTableModel(table);
    if (!modelResult.ok) {
      return modelResult.response;
    }
    const { model } = modelResult;

    const rawBody = await request.json();
    const parsedBody = transformAdminBody(model as string, rawBody);

    const data = await (prisma[model] as any).create({
      data: parsedBody,
      include: adminDynamicIncludes[model] || undefined,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(`CRUD ${await params.then(p=>p.table)} create error:`, error);
    if (error.code === "P2002") {
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
