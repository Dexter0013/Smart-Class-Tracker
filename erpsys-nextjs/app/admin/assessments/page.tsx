"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Assessment {
  id: string;
  assessmentName: string;
  maxMarks: number;
  assessmentDate: string | null;
  class: { id: string; course: { courseCode: string; courseName: string }; semester: { semesterName: string } };
}

interface Class {
  id: string;
  course: { courseCode: string; courseName: string };
  semester: { semesterName: string };
}

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    classId: "",
    assessmentName: "",
    maxMarks: "",
    assessmentDate: "",
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [assessRes, classesRes] = await Promise.all([
        fetch("/api/admin/assessments"),
        fetch("/api/admin/classes"),
      ]);

      if (!assessRes.ok) throw new Error("Failed to fetch assessments");
      if (!classesRes.ok) throw new Error("Failed to fetch classes");

      const [assessData, classesData] = await Promise.all([
        assessRes.json(),
        classesRes.json(),
      ]);

      setAssessments(assessData);
      setClasses(classesData);

      if (classesData.length > 0) {
        setFormData((prev) => ({
          ...prev,
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
      const url = editingId ? `/api/admin/assessments/${editingId}` : "/api/admin/assessments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save assessment");

      await fetchAllData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        classId: classes[0]?.id || "",
        assessmentName: "",
        maxMarks: "",
        assessmentDate: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving assessment");
    }
  };

  const handleEdit = (ass: Assessment) => {
    setEditingId(ass.id);
    setFormData({
      classId: ass.class.id,
      assessmentName: ass.assessmentName,
      maxMarks: ass.maxMarks.toString(),
      assessmentDate: ass.assessmentDate ? ass.assessmentDate.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAssessments(assessments.filter((a) => a.id !== id));
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Assessments</h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({
                  classId: classes[0]?.id || "",
                  assessmentName: "",
                  maxMarks: "",
                  assessmentDate: "",
                });
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold"
            >
              Add Assessment
            </button>
          </div>

          {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit Assessment" : "New Assessment"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Assessment Name (e.g. Midterm)"
                    value={formData.assessmentName}
                    onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Max Marks (e.g. 100)"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                  <input
                    type="date"
                    value={formData.assessmentDate}
                    onChange={(e) => setFormData({ ...formData, assessmentDate: e.target.value })}
                    className="border p-3 rounded text-gray-900"
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
                  <th className="px-6 py-3 text-left font-semibold border-b">Class / Course</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Assessment Name</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Max Marks</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Date</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{a.class.course.courseCode} - {a.class.semester.semesterName}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{a.assessmentName}</td>
                    <td className="px-6 py-4 text-gray-900">{a.maxMarks}</td>
                    <td className="px-6 py-4 text-gray-900">{isMounted && a.assessmentDate ? new Date(a.assessmentDate).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(a)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {assessments.length === 0 && <div className="text-center py-8 text-gray-500">No assessments found</div>}
        </div>
      </div>
    </ProtectedPage>
  );
}
