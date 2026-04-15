"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";

interface Department {
  id: string;
  departmentName: string;
  _count?: { students: number; instructors: number };
}

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDept, setNewDept] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading departments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim()) return;

    try {
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentName: newDept }),
      });

      if (!res.ok) throw new Error("Failed to add department");
      setNewDept("");
      fetchDepartments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding department");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchDepartments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Departments</h1>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
        <form onSubmit={handleAddDepartment} className="flex gap-2">
          <input
            type="text"
            placeholder="Department Name"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Students</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Instructors</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{dept.departmentName}</td>
                <td className="px-6 py-4">{dept._count?.students || 0}</td>
                <td className="px-6 py-4">{dept._count?.instructors || 0}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(dept.id)}
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

      {departments.length === 0 && (
        <div className="text-center py-8 text-gray-500">No departments found</div>
      )}
      </div>
    </ProtectedPage>
  );
}
