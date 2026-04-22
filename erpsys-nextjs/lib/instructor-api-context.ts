import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type InstructorApiContextSuccess = {
  ok: true;
  instructorId: string;
};

type InstructorApiContextFailure = {
  ok: false;
  response: NextResponse;
};

export type InstructorApiContext =
  | InstructorApiContextSuccess
  | InstructorApiContextFailure;

export async function resolveInstructorApiContext(): Promise<InstructorApiContext> {
  const user = await getAuthUser();

  if (!user || user.role !== "INSTRUCTOR") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const instructor = await prisma.instructor.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });

  if (!instructor) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Instructor profile not found" },
        { status: 404 },
      ),
    };
  }

  return {
    ok: true,
    instructorId: instructor.id,
  };
}
