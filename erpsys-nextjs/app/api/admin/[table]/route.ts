import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  resolveAdminApiContext,
  resolveAdminTableModel,
} from "@/lib/admin-api-context";

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

    const data = await (prisma[model] as any).findMany({
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("CRUD read error:", error);
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

    const body = await request.json();

    const data = await (prisma[model] as any).create({
      data: body,
    });

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Record created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CRUD create error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
