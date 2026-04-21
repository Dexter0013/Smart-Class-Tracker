"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import ProtectedPage from "@/components/ProtectedPage";

interface DashboardStats {
  studentCount: number;
  courseCount: number;
  instructorCount: number;
  departmentCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {stats ? (
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
          ) : (
            <div className="text-center text-gray-600">
              Failed to load dashboard data. Please try again.
            </div>
          )}

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
                <a
                  key={item}
                  href={`/admin/${item}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:border-teal-600 border-2 border-transparent transition text-teal-600 font-semibold capitalize"
                >
                  Manage {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        <ChatBot
          title="Admin Assistant"
          context="You are an administrative assistant helping with managing the education system. Answer questions about student records, course management, instructor assignments, and system administration."
        />
      </div>
    </ProtectedPage>
  );
}
