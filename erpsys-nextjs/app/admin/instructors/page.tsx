"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: { departmentName: string };
}

interface Department {
  id: string;
  departmentName: string;
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchInstructors();
    fetchDepartments();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/admin/instructors");
      if (!res.ok) throw new Error("Failed to fetch instructors");
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading instructors",
      );
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
        ? `/api/admin/instructors/${editingId}`
        : "/api/admin/instructors";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save instructor");

      await fetchInstructors();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        departmentId: departments[0]?.id || "",
        username: "",
        password: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving instructor");
    }
  };

  const handleEdit = (instructor: Instructor) => {
    const departmentId =
      departments.find(
        (dept) => dept.departmentName === instructor.department.departmentName,
      )?.id || "";
    setEditingId(instructor.id);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone || "",
      departmentId,
      username: "",
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setInstructors(instructors.filter((i) => i.id !== id));
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
              Manage Instructors
            </h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  departmentId: departments[0]?.id || "",
                  username: "",
                  password: "",
                });
              }}
              className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold text-center text-sm sm:text-base"
            >
              Add Instructor
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
                {editingId ? "Edit Instructor" : "Add New Instructor"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                  {!editingId && (
                    <>
                      <input
                        type="text"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      />
                    </>
                  )}
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
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden lg:table-cell">
                    Department
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="border-t hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold min-w-max whitespace-nowrap">
                      {instructor.name}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell text-xs">
                      {instructor.email}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden md:table-cell">
                      {instructor.phone || "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden lg:table-cell">
                      {instructor.department.departmentName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(instructor)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(instructor.id)}
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

          {instructors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No instructors found
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
