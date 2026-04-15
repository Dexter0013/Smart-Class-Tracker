"use client";

import { useState, useEffect } from "react";
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
      const url = editingId ? `/api/admin/semesters/${editingId}` : "/api/admin/semesters";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/semesters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSemesters(semesters.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Semesters</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
            setFormData({ semesterName: "", startDate: "", endDate: "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Semester
        </button>
      </div>

      {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Semester" : "Add New Semester"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Semester Name (e.g., Spring 2024)"
                required
                value={formData.semesterName}
                onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
                className="border p-2 rounded text-gray-900 placeholder-gray-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="border p-2 rounded w-full text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="border p-2 rounded w-full text-gray-900"
                  />
                </div>
              </div>
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Semester Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => (
              <tr key={semester.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{semester.semesterName}</td>
                <td className="px-6 py-4">{new Date(semester.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(semester.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(semester.id)}
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

      {semesters.length === 0 && (
        <div className="text-center py-8 text-gray-500">No semesters found</div>
      )}
      </div>
    </ProtectedPage>
  );
}
