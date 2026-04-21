import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminFailure, resolveAdminApiContext } from "@/lib/admin-api-context";

export async function GET(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const departments = await prisma.department.findMany({
      orderBy: { departmentName: "asc" },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return adminFailure("Failed to fetch departments");
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await resolveAdminApiContext(req);
    if (!context.ok) return context.response;

    const body = await req.json();
    const { departmentName } = body;

    if (!departmentName) {
      return adminFailure("Department name is required", 400);
    }

    const department = await prisma.department.create({
      data: { departmentName },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error("Error creating department:", error);
    if (error.code === "P2002") {
      return adminFailure("Department already exists", 400);
    }
    return adminFailure("Failed to create department");
  }
}
