"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      setError(err instanceof Error ? err.message : "Error loading instructors");
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
      const url = editingId ? `/api/admin/instructors/${editingId}` : "/api/admin/instructors";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setInstructors(instructors.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Instructors</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Instructor
        </button>
      </div>

      {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Instructor" : "Add New Instructor"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded text-gray-900 placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-2 rounded text-gray-900 placeholder-gray-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border p-2 rounded text-gray-900 placeholder-gray-500"
              />
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="border p-2 rounded text-gray-900"
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
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border p-2 rounded text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-2 rounded text-gray-900 placeholder-gray-500"
                  />
                </>
              )}
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{instructor.name}</td>
                <td className="px-6 py-4">{instructor.email}</td>
                <td className="px-6 py-4">{instructor.phone || "-"}</td>
                <td className="px-6 py-4">{instructor.department.departmentName}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(instructor.id)}
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

      {instructors.length === 0 && (
        <div className="text-center py-8 text-gray-500">No instructors found</div>
      )}
      </div>
    </ProtectedPage>
  );
}
