"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import ProtectedPage from "@/components/ProtectedPage";

interface Course {
  enrollmentId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  instructor: string;
  schedule: string;
  location: string;
  semester: string;
  finalGrade: string;
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/student/courses");
        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          router.push("/student/login");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        router.push("/student/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50">
        <Navbar userType="student" username={username || "Student"} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.enrollmentId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.courseName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
                        {course.finalGrade || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No courses enrolled yet.</p>
          </div>
        )}
      </div>
      <ChatBot
        title="Course Assistant"
        context="You are helping students understand their enrolled courses, assignments, and course materials. Answer questions about course content, deadlines, and study tips."
      />
      </div>
    </ProtectedPage>
  );
}
