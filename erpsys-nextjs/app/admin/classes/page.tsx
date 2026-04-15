"use client";

import { useState, useEffect } from "react";
import ProtectedPage from "@/components/ProtectedPage";

interface Class {
  id: string;
  course: { courseCode: string; courseName: string };
  instructor: { name: string };
  semester: { semesterName: string };
  location?: string;
  schedule?: string;
}

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
}

interface Instructor {
  id: string;
  name: string;
}

interface Semester {
  id: string;
  semesterName: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseId: "",
    instructorId: "",
    semesterId: "",
    location: "",
    schedule: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [classesRes, coursesRes, instructorsRes, semestersRes] = await Promise.all([
        fetch("/api/admin/classes"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/instructors"),
        fetch("/api/admin/semesters"),
      ]);

      if (!classesRes.ok) throw new Error("Failed to fetch classes");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      if (!instructorsRes.ok) throw new Error("Failed to fetch instructors");
      if (!semestersRes.ok) throw new Error("Failed to fetch semesters");

      const [classesData, coursesData, instructorsData, semestersData] = await Promise.all([
        classesRes.json(),
        coursesRes.json(),
        instructorsRes.json(),
        semestersRes.json(),
      ]);

      setClasses(classesData);
      setCourses(coursesData);
      setInstructors(instructorsData);
      setSemesters(semestersData);

      if (coursesData.length > 0 && instructorsData.length > 0 && semestersData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          courseId: coursesData[0].id,
          instructorId: instructorsData[0].id,
          semesterId: semestersData[0].id,
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
      const url = editingId ? `/api/admin/classes/${editingId}` : "/api/admin/classes";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save class");

      await fetchAllData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        courseId: courses[0]?.id || "",
        instructorId: instructors[0]?.id || "",
        semesterId: semesters[0]?.id || "",
        location: "",
        schedule: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving class");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Classes</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
            setFormData({
              courseId: courses[0]?.id || "",
              instructorId: instructors[0]?.id || "",
              semesterId: semesters[0]?.id || "",
              location: "",
              schedule: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Class" : "Add New Class"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="border p-2 rounded text-gray-900"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
              <select
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                className="border p-2 rounded text-gray-900"
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                className="border p-2 rounded text-gray-900"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Location (e.g., Room 101)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border p-2 rounded text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Schedule (e.g., Mon, Wed 10:00-11:00)"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="border p-2 rounded col-span-2 text-gray-900 placeholder-gray-500"
              />
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Course</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Instructor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Semester</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Schedule</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{cls.course.courseCode} - {cls.course.courseName}</td>
                <td className="px-6 py-4">{cls.instructor.name}</td>
                <td className="px-6 py-4">{cls.semester.semesterName}</td>
                <td className="px-6 py-4">{cls.location || "-"}</td>
                <td className="px-6 py-4">{cls.schedule || "-"}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(cls.id)}
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

      {classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">No classes found</div>
      )}
      </div>
    </ProtectedPage>
  );
}
