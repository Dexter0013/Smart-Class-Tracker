import { z } from "zod";

// Base Users
export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters").optional(),
  role: z.enum(["ADMIN", "STUDENT", "INSTRUCTOR"]).default("STUDENT"),
});

// Login
export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Admin Domain Schemas
export const CourseSchema = z.object({
  courseCode: z.string().min(2),
  courseName: z.string().min(3),
  credits: z.coerce.number().min(1).max(10).default(3),
  departmentId: z.string().min(1),
});

export const DepartmentSchema = z.object({
  departmentName: z.string().min(3),
});

export const ClassSchema = z.object({
  courseId: z.string().min(1),
  instructorId: z.string().min(1),
  semesterId: z.string().min(1),
  location: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
});

export const SemesterSchema = z.object({
  semesterName: z.string().min(3),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const AssessmentSchema = z.object({
  classId: z.string().min(1),
  assessmentName: z.string().min(2),
  maxMarks: z.coerce.number().min(1).max(500),
  assessmentDate: z.coerce.date().optional().nullable(),
});

export const StudentMarkSchema = z.object({
  studentId: z.string().min(1),
  assessmentId: z.string().min(1),
  marksObtained: z.coerce.number().min(0),
});

export const StudentSchema = z.object({
  userId: z.string().min(1).optional(), // Used in composite APIs
  name: z.string().min(2),
  rollNo: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  departmentId: z.string().min(1),
  dob: z.coerce.date().optional().nullable(),
});

export const InstructorSchema = z.object({
  userId: z.string().min(1).optional(), // Used in composite APIs
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  departmentId: z.string().min(1),
});

export const EnrollmentSchema = z.object({
  studentId: z.string().min(1),
  classId: z.string().min(1),
  finalGrade: z.string().optional().nullable(),
});

// Schema Resolver mapping for Generic [table] Proxy
export function getZodSchemaForTable(table: string) {
  switch (table.toLowerCase()) {
    case "course":
      return CourseSchema;
    case "department":
      return DepartmentSchema;
    case "class":
      return ClassSchema;
    case "semester":
      return SemesterSchema;
    case "assessment":
      return AssessmentSchema;
    case "studentmark":
    case "student_mark":
    case "marks":
      return StudentMarkSchema;
    case "student":
      return StudentSchema;
    case "instructor":
      return InstructorSchema;
    case "enrollment":
      return EnrollmentSchema;
    case "user":
      return UserSchema;
    default:
      // Return a passthrough schema if no exact match is found to gracefully not crash, 
      // but ideally we should reject.
      return z.record(z.any());
  }
}
