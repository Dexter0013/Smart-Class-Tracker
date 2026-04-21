"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface StudentMark {
  id: string;
  marksObtained: number;
  student: { id: string; name: string; rollNo: string };
  assessment: {
    id: string;
    assessmentName: string;
    maxMarks: number;
    class: { course: { courseCode: string }; semester: { semesterName: string } };
  };
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface Assessment {
  id: string;
  assessmentName: string;
  class: { course: { courseCode: string }; semester: { semesterName: string } };
}

export default function AdminMarksPage() {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    assessmentId: "",
    marksObtained: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [marksRes, studentsRes, assessRes] = await Promise.all([
        fetch("/api/admin/studentmarks"),
        fetch("/api/admin/students"),
        fetch("/api/admin/assessments"),
      ]);

      if (!marksRes.ok) throw new Error("Failed to fetch marks");
      if (!studentsRes.ok) throw new Error("Failed to fetch students");
      if (!assessRes.ok) throw new Error("Failed to fetch assessments");

      const [marksData, studentsData, assessData] = await Promise.all([
        marksRes.json(),
        studentsRes.json(),
        assessRes.json(),
      ]);

      setMarks(marksData);
      setStudents(studentsData);
      setAssessments(assessData);

      if (studentsData.length > 0 && assessData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          studentId: studentsData[0].id,
          assessmentId: assessData[0].id,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/studentmarks/${editingId}` : "/api/admin/studentmarks";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save mark");

      await fetchAllData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        studentId: students[0]?.id || "",
        assessmentId: assessments[0]?.id || "",
        marksObtained: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving mark (Ensure student isn't already graded for this assessment)");
    }
  };

  const handleEdit = (mark: StudentMark) => {
    setEditingId(mark.id);
    setFormData({
      studentId: mark.student.id,
      assessmentId: mark.assessment.id,
      marksObtained: mark.marksObtained.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/studentmarks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMarks(marks.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Marks</h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({
                  studentId: students[0]?.id || "",
                  assessmentId: assessments[0]?.id || "",
                  marksObtained: "",
                });
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold"
            >
              Add Mark
            </button>
          </div>

          {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit Mark" : "New Mark"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                  </select>
                  <select
                    value={formData.assessmentId}
                    onChange={(e) => setFormData({ ...formData, assessmentId: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  >
                    <option value="">Select Assessment</option>
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.assessmentName} ({a.class.course.courseCode})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Marks Obtained"
                    value={formData.marksObtained}
                    onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold">Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full text-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold border-b">Student</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Assessment</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Section</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Score</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{m.student.name}</td>
                    <td className="px-6 py-4 text-gray-900">{m.assessment.assessmentName}</td>
                    <td className="px-6 py-4 text-gray-900">{m.assessment.class.course.courseCode} - {m.assessment.class.semester.semesterName}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{m.marksObtained} / {m.assessment.maxMarks}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(m)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {marks.length === 0 && <div className="text-center py-8 text-gray-500">No marks found</div>}
        </div>
      </div>
    </ProtectedPage>
  );
}
