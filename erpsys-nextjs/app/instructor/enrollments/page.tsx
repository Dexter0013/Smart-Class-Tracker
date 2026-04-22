"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Enrollment {
  id: string;
  student: { name: string; rollNo: string };
  class: { course: { courseCode: string; courseName: string }; semester: { semesterName: string } };
  finalGrade: string;
}

export default function InstructorEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGrade, setEditingGrade] = useState<{ id: string; grade: string } | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/instructor/enrollments");
      const data = await res.json();
      setEnrollments(data);
    } catch {
      alert("Failed to fetch enrollments.");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editingGrade) return;

    try {
      const res = await fetch("/api/instructor/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: id, finalGrade: editingGrade.grade }),
      });

      if (!res.ok) throw new Error("Update failed");

      setEnrollments(enrollments.map((enr) => 
        enr.id === id ? { ...enr, finalGrade: editingGrade.grade } : enr
      ));
      setEditingGrade(null);
    } catch (err) {
      alert("Failed to update final grade. Make sure you are authorized.");
    }
  };

  return (
    <ProtectedPage requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Placeholder Navbar until updated */}
        <Navbar userType="instructor" username="Instructor" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Enrollments</h1>
          <p className="text-gray-600 mb-6 font-semibold">NOTE: You can only assign final grades here. Contact Admin to enroll/remove students.</p>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Class Details</th>
                  <th className="px-6 py-4 text-left">Student Info</th>
                  <th className="px-6 py-4 text-left">Final Rank/Grade</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div>{enr.class.course.courseCode} ({enr.class.semester.semesterName})</div>
                      <div className="text-xs text-gray-500">{enr.class.course.courseName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{enr.student.name}</div>
                      <div className="text-xs text-gray-500">Roll: {enr.student.rollNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingGrade?.id === enr.id ? (
                        <form onSubmit={(e) => handleGradeSubmit(e, enr.id)} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editingGrade.grade}
                            onChange={(e) => setEditingGrade({ ...editingGrade, grade: e.target.value })}
                            className="border p-1 rounded w-20 text-gray-900" 
                            autoFocus
                          />
                          <button type="submit" className="text-green-600 font-bold hover:underline">✓</button>
                          <button type="button" onClick={() => setEditingGrade(null)} className="text-red-500 font-bold hover:underline">✕</button>
                        </form>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${enr.finalGrade === 'N/A' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                          {enr.finalGrade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setEditingGrade({ id: enr.id, grade: enr.finalGrade === 'N/A' ? '' : enr.finalGrade })}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
                      >
                        Set Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrollments.length === 0 && <div className="text-center py-6 text-gray-500">No students are currently enrolled in any of your classes.</div>}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
