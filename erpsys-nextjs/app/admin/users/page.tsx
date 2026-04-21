"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save user");
      }

      await fetchUsers();
      setShowForm(false);
      setEditingId(null);
      setFormData({ username: "", email: "", password: "", role: "ADMIN" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Deliberately blank, only update if changed
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? WARNING: If this user is tied to a Student or Instructor profile, this may fail or orphan records!")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete");
      }
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <ProtectedPage requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="admin" username="Admin" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage System Users</h1>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
                setFormData({ username: "", email: "", password: "", role: "ADMIN" });
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold"
            >
              Add User
            </button>
          </div>

          {error && <div className="bg-red-100 p-4 mb-4 rounded text-red-700">{error}</div>}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit User System Access" : "Create New User"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder={editingId ? "Leave blank to keep current password" : "Password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-3 rounded text-gray-900 placeholder-gray-500"
                    required={!editingId}
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="border p-3 rounded text-gray-900"
                    required
                  >
                    <option value="ADMIN">ADMINISTRATOR</option>
                    <option value="INSTRUCTOR">INSTRUCTOR (No Profile Assigned)</option>
                    <option value="STUDENT">STUDENT (No Profile Assigned)</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold">Save Core User</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full text-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold border-b">Username</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Email</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Role</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Joined On</th>
                  <th className="px-6 py-3 text-left font-semibold border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{u.username}</td>
                    <td className="px-6 py-4 text-gray-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 font-semibold rounded-full text-xs ${u.role === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{isMounted ? new Date(u.createdAt).toLocaleDateString() : ""}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && <div className="text-center py-8 text-gray-500">No users found in database somehow (this is impossible)</div>}
        </div>
      </div>
    </ProtectedPage>
  );
}
