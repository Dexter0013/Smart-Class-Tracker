"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Semester {
  id: string;
  semesterName: string;
  startDate: string;
  endDate: string;
}

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    semesterName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/admin/semesters");
      if (!res.ok) throw new Error("Failed to fetch semesters");
      const data = await res.json();
      setSemesters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading semesters");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/semesters/${editingId}`
        : "/api/admin/semesters";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save semester");

      await fetchSemesters();
      setShowForm(false);
      setEditingId(null);
      setFormData({ semesterName: "", startDate: "", endDate: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving semester");
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditingId(semester.id);
    setFormData({
      semesterName: semester.semesterName,
      startDate: semester.startDate.split("T")[0],
      endDate: semester.endDate.split("T")[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/semesters/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSemesters(semesters.filter((s) => s.id !== id));
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
              Manage Semesters
            </h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({ semesterName: "", startDate: "", endDate: "" });
              }}
              className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold text-center text-sm sm:text-base"
            >
              Add Semester
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
                {editingId ? "Edit Semester" : "Add New Semester"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Semester Name (e.g., Spring 2024)"
                    required
                    value={formData.semesterName}
                    onChange={(e) =>
                      setFormData({ ...formData, semesterName: e.target.value })
                    }
                    className="border p-2 sm:p-3 rounded text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="border p-2 sm:p-3 rounded w-full text-gray-900 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="border p-2 sm:p-3 rounded w-full text-gray-900 text-sm sm:text-base"
                      />
                    </div>
                  </div>
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
                    Semester Name
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Start Date
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">
                    End Date
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((semester) => (
                  <tr key={semester.id} className="border-t hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 min-w-max whitespace-nowrap">
                      {semester.semesterName}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900">
                      {new Date(semester.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell">
                      {new Date(semester.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(semester)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(semester.id)}
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

          {semesters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No semesters found
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
