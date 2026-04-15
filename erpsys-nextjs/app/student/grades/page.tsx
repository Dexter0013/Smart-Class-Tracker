"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import ProtectedPage from "@/components/ProtectedPage";

interface Grade {
  courseCode: string;
  courseName: string;
  assessmentName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: string;
  status: string;
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch("/api/student/grades");
        const data = await response.json();

        if (data.success) {
          setGrades(data.data);
        } else {
          router.push("/student/login");
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
        router.push("/student/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Grades</h1>

        {grades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div className="font-semibold text-gray-900">
                        {grade.courseCode}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {grade.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grade.assessmentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {grade.marksObtained} / {grade.maxMarks}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grade.percentage}%
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${
                          grade.status === "Pass"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {grade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No grades available yet.</p>
          </div>
        )}
      </div>
      <ChatBot
        title="Grades Assistant"
        context="You are helping students understand their grades, assessments, and performance. Answer questions about how grades are calculated, how to improve, and academic progress."
      />
      </div>
    </ProtectedPage>
  );
}
