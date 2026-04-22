"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Class {
  id: string;
  course: { courseCode: string; courseName: string };
  semester: { semesterName: string };
}

interface Assessment {
  id: string;
  classId: string;
  assessmentName: string;
  maxMarks: number;
  assessmentDate: string;
  _count: { marks: number };
  class: { course: { courseCode: string }; semester: { semesterName: string } };
}

export default function InstructorAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    classId: "",
    assessmentName: "",
    maxMarks: "",
    assessmentDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assRes, clsRes] = await Promise.all([
        fetch("/api/instructor/assessments"),
        fetch("/api/instructor/classes")
      ]);
      const assData = await assRes.json();
      const clsData = await clsRes.json();
      
      setAssessments(assData);
      setClasses(clsData);

      if (clsData.length > 0) {
        setFormData(prev => ({ ...prev, classId: clsData[0].id }));
      }
    } catch {
      alert("Error loading assessment data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/instructor/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create");
      }

      await fetchData();
      setShowForm(false);
      setFormData({ ...formData, assessmentName: "", maxMarks: "", assessmentDate: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating assessment");
    }
  };

  const handleDelete = async (id: string, lockData: number) => {
    if (lockData > 0) {
      alert("Cannot delete an assessment that already has student marks attached. Remove the marks first.");
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/instructor/assessments/${id}`, { method: "DELETE" });
      setAssessments(assessments.filter(a => a.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <ProtectedPage requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="instructor" username="Instructor" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Course Assessments</h1>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              + Create Assessment
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500 mb-8">
              <h2 className="text-xl font-bold mb-4">Create New Assessment Component</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Target Class</label>
                  <select 
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                    className="w-full border p-2 rounded text-gray-900"
                    required
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.course.courseCode} ({c.semester.semesterName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Assessment Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Final Protocol Review"
                    value={formData.assessmentName}
                    onChange={(e) => setFormData({...formData, assessmentName: e.target.value})}
                    className="w-full border p-2 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Maximum Marks</label>
                  <input 
                    type="number" 
                    placeholder="100"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                    className="w-full border p-2 rounded text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input 
                    type="datetime-local" 
                    value={formData.assessmentDate}
                    onChange={(e) => setFormData({...formData, assessmentDate: e.target.value})}
                    className="w-full border p-2 rounded text-gray-900"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2 mt-2">
                  <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-6 rounded shadow hover:bg-green-700">Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded shadow">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Assessment Detail</th>
                  <th className="px-6 py-4 text-left">Class Context</th>
                  <th className="px-6 py-4 text-left">Max Scoring</th>
                  <th className="px-6 py-4 text-left">Completion</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((ass) => (
                  <tr key={ass.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{ass.assessmentName}</div>
                      <div className="text-xs text-gray-500">{ass.assessmentDate ? new Date(ass.assessmentDate).toLocaleString() : 'No date'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{ass.class.course.courseCode}</div>
                      <div className="text-xs text-gray-500">{ass.class.semester.semesterName}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                      {ass.maxMarks}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {ass._count.marks} Graded
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(ass.id, ass._count.marks)}
                        className={`font-semibold text-sm ${ass._count.marks > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assessments.length === 0 && <div className="text-center py-6 text-gray-500">No assessments created for your classes yet.</div>}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
