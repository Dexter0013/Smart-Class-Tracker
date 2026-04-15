"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  department: { departmentName: string };
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    credits: "3",
    departmentId: "",
  });
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, departmentId: data[0].id }));
      }
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          credits: parseInt(formData.credits),
        }),
      });

      if (!res.ok) throw new Error("Failed to save course");

      await fetchCourses();
      setShowForm(false);
      setEditingId(null);
      setFormData({ courseCode: "", courseName: "", credits: "3", departmentId: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving course");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits.toString(),
      departmentId: "", // Will need to be fetched
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
            setFormData({ courseCode: "", courseName: "", credits: "3", departmentId: departments[0]?.id || "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </div>

      {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Course" : "Add New Course"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Code"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Course Name"
                required
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Credits"
                required
                min="1"
                max="4"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="border p-2 rounded"
              />
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Course Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Credits</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{course.courseCode}</td>
                <td className="px-6 py-4">{course.courseName}</td>
                <td className="px-6 py-4 text-center">{course.credits}</td>
                <td className="px-6 py-4">{course.department.departmentName}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      )}
      </div>
    </ProtectedPage>
  );
}
