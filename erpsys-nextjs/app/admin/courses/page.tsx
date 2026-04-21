"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
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
      const url = editingId
        ? `/api/admin/courses/${editingId}`
        : "/api/admin/courses";

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
      setFormData({
        courseCode: "",
        courseName: "",
        credits: "3",
        departmentId: "",
      });
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


  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Courses
            </h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({
                  courseCode: "",
                  courseName: "",
                  credits: "3",
                  departmentId: departments[0]?.id || "",
                });
              }}
              className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold text-center text-sm sm:text-base"
            >
              Add Course
            </button>
          </div>

          {error && (
            <div className="bg-red-100 p-3 sm:p-4 mb-4 rounded text-red-700 text-sm sm:text-base">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit Course" : "Add New Course"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Course Code"
                    required
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({ ...formData, courseCode: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Course Name"
                    required
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({ ...formData, courseName: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    required
                    min="1"
                    max="4"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({ ...formData, credits: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 text-sm sm:text-base"
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
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold text-sm sm:text-base"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Code
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">
                    Credits
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-mono text-gray-900 min-w-max whitespace-nowrap">
                      {course.courseCode}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 min-w-max whitespace-nowrap">
                      {course.courseName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-900 hidden sm:table-cell">
                      {course.credits}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden md:table-cell">
                      {course.department.departmentName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:underline text-xs sm:text-sm"
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
            <div className="text-center py-8 text-gray-500">
              No courses found
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
