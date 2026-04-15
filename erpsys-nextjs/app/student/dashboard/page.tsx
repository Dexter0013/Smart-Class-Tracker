"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import ProtectedPage from "@/components/ProtectedPage";

interface Course {
  courseCode: string;
  courseName: string;
  instructor: string;
  schedule: string;
  finalGrade: string;
}

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/student/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="student" username="Student" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Enrolled Courses
            </h2>

            {courses.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.courseCode}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {course.courseName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {course.courseCode}
                        </p>
                      </div>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {course.finalGrade || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-600">Instructor</p>
                        <p className="font-semibold text-gray-900">
                          {course.instructor}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Schedule</p>
                        <p className="font-semibold text-gray-900">
                          {course.schedule || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                No courses enrolled yet
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Links</h2>
            <div className="space-y-2 sm:space-y-3">
              <a
                href="/student/courses"
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-600 border-2 border-transparent transition text-teal-600 font-semibold text-sm sm:text-base"
              >
                View All Courses
              </a>
              <a
                href="/student/grades"
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-600 border-2 border-transparent transition text-teal-600 font-semibold text-sm sm:text-base"
              >
                View Grades
              </a>
              <a
                href="/student/profile"
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-600 border-2 border-transparent transition text-teal-600 font-semibold text-sm sm:text-base"
              >
                My Profile
              </a>
            </div>
          </div>
        </div>
      </div>
      <ChatBot
        title="Educational Assistant"
        context="You are helping students with their academic journey. Answer questions about courses, assignments, grades, and provide study guidance."
      />
      </div>
    </ProtectedPage>
  );
}
