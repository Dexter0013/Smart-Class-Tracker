import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    redirect(user ? "/" : "/admin/login");
  }

  const [studentCount, courseCount, instructorCount, departmentCount] =
    await Promise.all([
      prisma.student.count(),
      prisma.course.count(),
      prisma.instructor.count(),
      prisma.department.count(),
    ]);

  const stats = { studentCount, courseCount, instructorCount, departmentCount };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar userType="admin" username="Admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">
              Total Students
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.studentCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">
              Total Courses
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.courseCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">
              Total Instructors
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.instructorCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">
              Total Departments
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.departmentCount}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Management Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "students",
              "instructors",
              "courses",
              "departments",
              "semesters",
              "classes",
            ].map((item) => (
              <Link
                key={item}
                href={`/admin/${item}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:border-teal-600 border-2 border-transparent transition text-teal-600 font-semibold capitalize"
              >
                Manage {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ChatBot
        title="Admin Assistant"
        context="You are an administrative assistant helping with managing the education system. Answer questions about student records, course management, instructor assignments, and system administration."
      />
    </div>
  );
}
