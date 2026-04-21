"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Enrollment {
  id: string;
  student: { id: string; name: string; rollNo: string };
  class: { id: string; course: { courseCode: string; courseName: string }; semester: { semesterName: string } };
  enrollmentDate: string;
  finalGrade?: string;
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface Class {
  id: string;
  course: { courseCode: string; courseName: string };
  semester: { semesterName: string };
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    finalGrade: "N/A",
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [enrollRes, studentsRes, classesRes] = await Promise.all([
        fetch("/api/admin/enrollments"),
        fetch("/api/admin/students"),
        fetch("/api/admin/classes"),
      ]);

      if (!enrollRes.ok) throw new Error("Failed to fetch enrollments");
      if (!studentsRes.ok) throw new Error("Failed to fetch students");
      if (!classesRes.ok) throw new Error("Failed to fetch classes");

      const [enrollData, studentsData, classesData] = await Promise.all([
        enrollRes.json(),
        studentsRes.json(),
        classesRes.json(),
      ]);

      setEnrollments(enrollData);
      setStudents(studentsData);
      setClasses(classesData);

      if (studentsData.length > 0 && classesData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          studentId: studentsData[0].id,
          classId: classesData[0].id,
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
      const url = editingId ? `/api/admin/enrollments/${editingId}` : "/api/admin/enrollments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save enrollment");

      await fetchAllData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        studentId: students[0]?.id || "",
        classId: classes[0]?.id || "",
        finalGrade: "N/A",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving enrollment");
    }
  };

  const handleEdit = (enr: Enrollment) => {
    setEditingId(enr.id);
    setFormData({
      studentId: enr.student.id,
      classId: enr.class.id,
      finalGrade: enr.finalGrade || "N/A",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEnrollments(enrollments.filter((e) => e.id !== id));
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Enrollments</h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({
                  studentId: students[0]?.id || "",
                  classId: classes[0]?.id || "",
                  finalGrade: "N/A",
                });
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold"
            >
              Enroll Student
            </button>
          </div>

          {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit Enrollment" : "New Enrollment"}
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
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course.courseCode} - {c.semester.semesterName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Final Grade (e.g. A+, B-)"
                    value={formData.finalGrade}
                    onChange={(e) => setFormData({ ...formData, finalGrade: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
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
                  <th className="px-6 py-3 text-left font-semibold border-b">Course</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Semester</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Enrolled On</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Grade</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{enr.student.name}</td>
                    <td className="px-6 py-4 text-gray-900">{enr.class.course.courseCode}</td>
                    <td className="px-6 py-4 text-gray-900">{enr.class.semester.semesterName}</td>
                    <td className="px-6 py-4 text-gray-900">{isMounted ? new Date(enr.enrollmentDate).toLocaleDateString() : ""}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{enr.finalGrade}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(enr)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(enr.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {enrollments.length === 0 && <div className="text-center py-8 text-gray-500">No enrollments found</div>}
        </div>
      </div>
    </ProtectedPage>
  );
}
