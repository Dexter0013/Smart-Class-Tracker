"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Class {
  id: string;
  course: { id: string; courseCode: string; courseName: string };
  instructor: { id: string; name: string };
  semester: { id: string; semesterName: string };
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
      const [classesRes, coursesRes, instructorsRes, semestersRes] =
        await Promise.all([
          fetch("/api/admin/classes"),
          fetch("/api/admin/courses"),
          fetch("/api/admin/instructors"),
          fetch("/api/admin/semesters"),
        ]);

      if (!classesRes.ok) throw new Error("Failed to fetch classes");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      if (!instructorsRes.ok) throw new Error("Failed to fetch instructors");
      if (!semestersRes.ok) throw new Error("Failed to fetch semesters");

      const [classesData, coursesData, instructorsData, semestersData] =
        await Promise.all([
          classesRes.json(),
          coursesRes.json(),
          instructorsRes.json(),
          semestersRes.json(),
        ]);

      setClasses(classesData);
      setCourses(coursesData);
      setInstructors(instructorsData);
      setSemesters(semestersData);

      if (
        coursesData.length > 0 &&
        instructorsData.length > 0 &&
        semestersData.length > 0
      ) {
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
      const url = editingId
        ? `/api/admin/classes/${editingId}`
        : "/api/admin/classes";

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

  const handleEdit = (cls: Class) => {
    setEditingId(cls.id);
    setFormData({
      courseId: cls.course.id,
      instructorId: cls.instructor.id,
      semesterId: cls.semester.id,
      location: cls.location || "",
      schedule: cls.schedule || "",
    });
    setShowForm(true);
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Classes
            </h1>
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
              className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold text-center text-sm sm:text-base"
            >
              Add Class
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
                {editingId ? "Edit Class" : "Add New Class"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 text-sm sm:text-base"
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
                    onChange={(e) =>
                      setFormData({ ...formData, instructorId: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 text-sm sm:text-base"
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
                    onChange={(e) =>
                      setFormData({ ...formData, semesterId: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 text-sm sm:text-base"
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
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Schedule (e.g., Mon, Wed 10:00-11:00)"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded col-span-1 sm:col-span-2 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
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
                    Course
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">
                    Instructor
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">
                    Semester
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden lg:table-cell">
                    Schedule
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-t hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold min-w-max whitespace-nowrap">
                      {cls.course.courseCode} - {cls.course.courseName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell min-w-max whitespace-nowrap">
                      {cls.instructor.name}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden md:table-cell">
                      {cls.semester.semesterName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden lg:table-cell">
                      {cls.location || "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden lg:table-cell">
                      {cls.schedule || "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
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

          {classes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No classes found
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
