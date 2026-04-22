import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InstructorDashboard() {
  const user = await getAuthUser();
  if (!user || user.role !== "INSTRUCTOR") {
    redirect("/instructor/login");
  }

  const instructor = await prisma.instructor.findUnique({
    where: { userId: user.userId },
  });

  if (!instructor) {
    redirect("/instructor/login");
  }

  const classes = await prisma.class.findMany({
    where: { instructorId: instructor.id },
    include: {
      course: true,
      semester: true,
      _count: { select: { enrollments: true, assessments: true } },
    },
  });

  return (
    <ProtectedPage requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="instructor" username={user.username} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {instructor.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/instructor/enrollments" className="block bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg p-6 transition transform hover:-translate-y-1">
              <h2 className="text-xl font-bold mb-2">Enrollments</h2>
              <p className="opacity-90 text-sm">View students in your classes and assign final course grades.</p>
            </Link>

            <Link href="/instructor/assessments" className="block bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg p-6 transition transform hover:-translate-y-1">
              <h2 className="text-xl font-bold mb-2">Assessments</h2>
              <p className="opacity-90 text-sm">Create and manage your specific class midterms and assignments.</p>
            </Link>

            <Link href="/instructor/marks" className="block bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg p-6 transition transform hover:-translate-y-1">
              <h2 className="text-xl font-bold mb-2">Assign Marks</h2>
              <p className="opacity-90 text-sm">Grade students natively on your active assessments.</p>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{cls.course.courseCode}</h3>
                    <p className="text-sm text-gray-600">{cls.course.courseName}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {cls.semester.semesterName}
                  </span>
                </div>
                
                <div className="space-y-2 mt-4 text-sm text-gray-700">
                  <div className="flex justify-between border-b pb-1">
                    <span>Schedule</span>
                    <span className="font-semibold">{cls.schedule || "TBA"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Enrolled Students</span>
                    <span className="font-semibold text-indigo-600">{cls._count.enrollments}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Total Assessments</span>
                    <span className="font-semibold">{cls._count.assessments}</span>
                  </div>
                </div>
              </div>
            ))}

            {classes.length === 0 && (
              <div className="col-span-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
                You are not currently assigned to any classes. Contact administration.
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
