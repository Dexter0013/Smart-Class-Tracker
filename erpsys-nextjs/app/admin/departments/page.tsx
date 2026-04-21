"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
  const [editingId, setEditingId] = useState<string | null>(null);

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
      setError(
        err instanceof Error ? err.message : "Error loading departments",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim()) return;

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/departments/${editingId}`
        : "/api/admin/departments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentName: newDept }),
      });

      if (!res.ok)
        throw new Error(`Failed to ${editingId ? "update" : "add"} department`);
      setNewDept("");
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : `Error ${editingId ? "updating" : "adding"} department`,
      );
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setNewDept(dept.departmentName);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setEditingId(null);
      setNewDept("");
      fetchDepartments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };


  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Manage Departments
          </h1>

          {error && (
            <div className="bg-red-100 p-3 sm:p-4 mb-4 rounded text-red-700 text-sm sm:text-base">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Department" : "Add New Department"}
            </h2>
            <form
              onSubmit={handleAddDepartment}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Department Name"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-teal-700 font-semibold text-sm sm:text-base"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewDept("");
                  }}
                  className="w-full sm:w-auto bg-gray-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-gray-700 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Department
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Students
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Instructors
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 min-w-max whitespace-nowrap">
                      {dept.departmentName}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900">
                      {dept._count?.students || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900">
                      {dept._count?.instructors || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="text-blue-600 hover:underline text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="text-red-600 hover:underline text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {departments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No departments found
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
