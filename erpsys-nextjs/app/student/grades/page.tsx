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

  return (
    <ProtectedPage requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="student" username={username || "Student"} />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            My Grades
          </h1>

          {grades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md text-xs sm:text-sm">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                      Course
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">
                      Assessment
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                      Marks
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">
                      Percentage
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm min-w-max whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {grade.courseCode}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {grade.courseName}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell">
                        {grade.assessmentName}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-semibold">
                        {grade.marksObtained} / {grade.maxMarks}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden md:table-cell">
                        {grade.percentage}%
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full font-semibold ${
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
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-lg">
                No grades available yet.
              </p>
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
