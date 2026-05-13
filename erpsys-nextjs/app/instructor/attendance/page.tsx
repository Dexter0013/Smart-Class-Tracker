"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface Class {
  id: string;
  course: { courseCode: string; courseName: string };
  semester: { semesterName: string };
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  status: string;
}

interface AttendanceSheet {
  id: string;
  date: string;
  subject?: string;
  records: AttendanceRecord[];
}

export default function InstructorAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceList, setAttendanceList] = useState<AttendanceSheet[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { username } = useCurrentUser();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    attendance: {} as { [studentId: string]: string },
  });

  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      setIsFetchingData(true);
      Promise.all([fetchAttendance(), fetchStudents()]).finally(() => {
        setIsFetchingData(false);
      });
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/instructor/classes");
      const data = await res.json();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch {
      alert("Error loading classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/instructor/attendance?classId=${selectedClassId}`);
      const data = await res.json();
      setAttendanceList(Array.isArray(data) ? data : []);
    } catch {
      console.error("Error loading attendance");
      setAttendanceList([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/instructor/enrollments?classId=${selectedClassId}`);
      const data = await res.json();
      const enrollments = Array.isArray(data) ? data : [];
      const uniqueStudents = Array.from(
        new Map(enrollments.map((e: any) => [e.student.id, e.student])).values()
      );
      setStudents(uniqueStudents as Student[]);

      const initialAttendance: { [key: string]: string } = {};
      uniqueStudents.forEach((s: any) => {
        initialAttendance[s.id] = "PRESENT";
      });
      setFormData(prev => ({ ...prev, attendance: initialAttendance }));
    } catch {
      console.error("Error loading students");
      setStudents([]);
    }
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setFormData(prev => ({
      ...prev,
      attendance: { ...prev.attendance, [studentId]: status },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const records = Object.entries(formData.attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      const res = await fetch("/api/instructor/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassId,
          date: formData.date,
          subject: formData.subject,
          records,
        }),
      });

      if (res.ok) {
        alert("Attendance recorded successfully!");
        setShowForm(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          subject: "",
          attendance: formData.attendance,
        });
        fetchAttendance();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert("Failed to record attendance: " + (errData.message || res.statusText));
      }
    } catch (err: any) {
      alert("Error recording attendance: " + err.message);
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <ProtectedPage requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="instructor" username={username || "Instructor"} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <a
              href="/api/instructor/export"
              download
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Class Data
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-lg text-gray-600 font-medium">Loading classes...</span>
            </div>
          ) : (
            <>

          {/* Class Selector */}
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.course.courseCode} - {cls.course.courseName} ({cls.semester.semesterName})
                </option>
              ))}
            </select>
          </div>

          {/* Add Attendance Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              + Mark Attendance
            </button>
          )}

          {/* Attendance Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Mark Attendance</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Optional subject/topic"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Students</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <span className="text-sm text-gray-900">
                        {student.name} ({student.rollNo})
                      </span>
                      <select
                        value={formData.attendance[student.id] || "PRESENT"}
                        onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="EXCUSED">Excused</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!selectedClassId}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Attendance
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Attendance History */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Subject</th>
                  <th className="px-6 py-3 text-left">Present</th>
                  <th className="px-6 py-3 text-left">Absent</th>
                  <th className="px-6 py-3 text-left">Late</th>
                  <th className="px-6 py-3 text-left">Excused</th>
                  <th className="px-6 py-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {isFetchingData ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600 font-medium">Fetching attendance records...</span>
                      </div>
                    </td>
                  </tr>
                ) : !Array.isArray(attendanceList) || attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No attendance records yet
                    </td>
                  </tr>
                ) : (
                  attendanceList.map(att => {
                    const records = Array.isArray(att.records) ? att.records : [];
                    const stats = {
                      present: records.filter(r => r.status === "PRESENT").length,
                      absent: records.filter(r => r.status === "ABSENT").length,
                      late: records.filter(r => r.status === "LATE").length,
                      excused: records.filter(r => r.status === "EXCUSED").length,
                    };
                    return (
                      <tr key={att.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900">
                          {new Date(att.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-900">{att.subject || "-"}</td>
                        <td className="px-6 py-4 text-green-600 font-semibold">{stats.present}</td>
                        <td className="px-6 py-4 text-red-600 font-semibold">{stats.absent}</td>
                        <td className="px-6 py-4 text-yellow-600 font-semibold">{stats.late}</td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">{stats.excused}</td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{records.length}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
