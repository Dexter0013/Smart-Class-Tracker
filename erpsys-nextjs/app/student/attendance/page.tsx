"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface AttendanceData {
  id: string;
  status: string;
  attendance: {
    date: string;
    subject?: string;
    class: {
      course: { courseCode: string; courseName: string };
      semester: { semesterName: string };
    };
  };
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useCurrentUser();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/student/attendance");
      const data = await res.json();
      setAttendance(data);
    } catch {
      alert("Error loading attendance");
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(attendance)) {
    return (
      <ProtectedPage requiredRole="STUDENT">
        <div className="min-h-screen bg-gray-50 pt-20">
          <Navbar userType="student" username={username || "Student"} />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-red-600">Error loading attendance data</p>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  const groupedByClass = attendance.reduce((acc, rec) => {
    const classKey = rec.attendance?.class?.course?.courseCode || "Unknown";
    if (!acc[classKey]) {
      acc[classKey] = {
        course: rec.attendance?.class?.course || { courseCode: classKey, courseName: "Unknown" },
        semester: rec.attendance?.class?.semester || { semesterName: "Unknown" },
        records: [],
      };
    }
    acc[classKey].records.push(rec);
    return acc;
  }, {} as any);

  return (
    <ProtectedPage requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="student" username={username || "Student"} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Attendance</h1>

          {loading ? (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-lg text-gray-600 font-medium">Loading your attendance...</span>
            </div>
          ) : Object.keys(groupedByClass).length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No attendance records yet</p>
            </div>
          ) : (
            Object.entries(groupedByClass).map(([classKey, data]: [string, any]) => {
            const present = data.records.filter((r: any) => r.status === "PRESENT").length;
            const total = data.records.length;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

            return (
              <div key={classKey} className="mb-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-indigo-600 text-white p-4">
                  <h2 className="text-xl font-bold">
                    {data.course.courseCode} - {data.course.courseName}
                  </h2>
                  <p className="text-indigo-100 text-sm">{data.semester.semesterName}</p>
                </div>

                <div className="p-4 grid grid-cols-3 gap-4 border-b border-gray-200">
                  <div className="bg-green-50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">{present}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-red-600">{total - present}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                    <div className="text-sm text-gray-600">Attendance</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-gray-700">Subject</th>
                        <th className="px-4 py-3 text-left text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.records
                        .sort((a: any, b: any) => new Date(b.attendance.date).getTime() - new Date(a.attendance.date).getTime())
                        .map((rec: any) => (
                          <tr key={rec.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">
                              {new Date(rec.attendance.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {rec.attendance.subject || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  rec.status === "PRESENT"
                                    ? "bg-green-100 text-green-800"
                                    : rec.status === "ABSENT"
                                    ? "bg-red-100 text-red-800"
                                    : rec.status === "LATE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </ProtectedPage>
  );
};
