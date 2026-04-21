import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type StudentApiContextSuccess = {
  ok: true;
  studentId: string;
};

type StudentApiContextFailure = {
  ok: false;
  response: NextResponse;
};

export type StudentApiContext =
  | StudentApiContextSuccess
  | StudentApiContextFailure;

export async function resolveStudentApiContext(): Promise<StudentApiContext> {
  const user = await getAuthUser();

  if (!user || user.role !== "STUDENT") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });

  if (!student) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      ),
    };
  }

  return {
    ok: true,
    studentId: student.id,
  };
}
