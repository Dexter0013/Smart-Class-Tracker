"use client";

import { useState, useEffect } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface AttendanceSheet {
  id: string;
  date: string;
  subject?: string;
  class: {
    id: string;
    course: { courseCode: string; courseName: string };
    instructor: { name: string };
    semester: { semesterName: string };
  };
  records: Array<{
    id: string;
    status: string;
    student: { name: string; rollNo: string };
  }>;
}

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useCurrentUser();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/admin/attendance");
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch {
      alert("Error loading attendance");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 ">

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
            <a
              href="/api/admin/export"
              download
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export System Data
            </a>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-4 text-lg text-gray-600 font-medium">Loading attendance reports...</span>
              </div>
            ) : !Array.isArray(attendance) || attendance.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No attendance records yet</p>
              </div>
            ) : (
              attendance.map(sheet => {
                const records = Array.isArray(sheet.records) ? sheet.records : [];
                return (
                  <div key={sheet.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-indigo-600 text-white p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold">
                            {sheet.class?.course?.courseCode} - {sheet.class?.course?.courseName}
                          </h2>
                          <p className="text-indigo-100 text-sm">
                            Instructor: {sheet.class?.instructor?.name} | {sheet.class?.semester?.semesterName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {new Date(sheet.date).toLocaleDateString()}
                          </p>
                          {sheet.subject && (
                            <p className="text-indigo-100 text-sm">{sheet.subject}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-gray-700">Roll No</th>
                            <th className="px-4 py-3 text-left text-gray-700">Student Name</th>
                            <th className="px-4 py-3 text-left text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.map(record => (
                            <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900 font-medium">{record.student?.rollNo || "-"}</td>
                              <td className="px-4 py-3 text-gray-900">{record.student?.name || "-"}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    record.status === "PRESENT"
                                      ? "bg-green-100 text-green-800"
                                      : record.status === "ABSENT"
                                      ? "bg-red-100 text-red-800"
                                      : record.status === "LATE"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
