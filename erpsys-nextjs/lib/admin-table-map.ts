import { prisma } from "@/lib/db";

const adminTableMap: Record<string, keyof typeof prisma> = {
  students: "student",
  instructors: "instructor",
  courses: "course",
  departments: "department",
  classes: "class",
  semesters: "semester",
  enrollments: "enrollment",
  assessments: "assessment",
  studentmarks: "studentMark",
  users: "user",
};

export function getAdminModelFromTable(
  table: string,
): keyof typeof prisma | null {
  return adminTableMap[table.toLowerCase()] ?? null;
}
