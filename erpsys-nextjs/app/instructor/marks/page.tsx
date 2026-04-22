"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedPage from "@/components/ProtectedPage";

interface Assessment {
  id: string;
  assessmentName: string;
  maxMarks: number;
  class: { course: { courseCode: string }; semester: { semesterName: string } };
}

interface Mark {
  student: { id: string; name: string; rollNo: string };
  marksObtained: number;
}

export default function InstructorMarksPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssId, setSelectedAssId] = useState<string>("");
  const [activeMarks, setActiveMarks] = useState<Mark[]>([]);
  const [enrollmentsMap, setEnrollmentsMap] = useState<any[]>([]); // To map missing students
  const [formGrades, setFormGrades] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAssessments();
    fetchEnrollmentDictionary();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/instructor/assessments");
      const data = await res.json();
      setAssessments(data);
    } catch {
      alert("Error loading assessments");
    }
  };

  const fetchEnrollmentDictionary = async () => {
    try {
      const res = await fetch("/api/instructor/enrollments");
      const data = await res.json();
      setEnrollmentsMap(data);
    } catch {
      console.error("Error dict");
    }
  };

  const handleAssessmentSelect = async (assId: string) => {
    setSelectedAssId(assId);
    if (!assId) return;

    try {
      const res = await fetch(`/api/instructor/marks?assessmentId=${assId}`);
      const data = await res.json();
      setActiveMarks(data);

      const newGrades: { [key: string]: string } = {};
      data.forEach((m: any) => {
        newGrades[m.student.id] = String(m.marksObtained);
      });
      setFormGrades(newGrades);
    } catch {
      alert("Error loading student marks");
    }
  };

  const submitSingleGrade = async (studentId: string) => {
    const marksObtained = formGrades[studentId];
    if (marksObtained === undefined || marksObtained === "") return;

    try {
      const res = await fetch("/api/instructor/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: selectedAssId,
          studentId,
          marksObtained
        })
      });

      if (!res.ok) throw new Error("Failed");
      
      const el = document.getElementById(`btn-${studentId}`);
      if (el) {
        el.innerText = "Saved!";
        el.classList.add("bg-green-600");
        setTimeout(() => {
          el.innerText = "Save";
          el.classList.remove("bg-green-600");
        }, 2000);
      }
    } catch {
      alert("Error saving grade");
    }
  };

  // Derive students to display based on the selected assessment's classId
  const selectedAss = assessments.find(a => a.id === selectedAssId);
  const relevantEnrollments = selectedAss 
    ? enrollmentsMap.filter((e: any) => e.classId === selectedAss.classId)
    : [];

  return (
    <ProtectedPage requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="instructor" username="Instructor" />
        
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Assign Marks to Students</h1>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500 mb-8">
            <h2 className="text-sm font-semibold mb-2 text-gray-600 uppercase tracking-widest">Global Select Assessment</h2>
            <select 
              value={selectedAssId} 
              onChange={(e) => handleAssessmentSelect(e.target.value)}
              className="w-full border p-3 rounded-lg text-lg text-gray-900 focus:ring-purple-500"
            >
              <option value="">-- Choose an active assessment to grade --</option>
              {assessments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.assessmentName} - {a.class.course.courseCode} (Max: {a.maxMarks})
                </option>
              ))}
            </select>
          </div>

          {selectedAssId && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Student</th>
                    <th className="px-6 py-4 text-left">Marks Obtained</th>
                    <th className="px-6 py-4 text-left">Submit</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantEnrollments.map((enr) => {
                    const sid = enr.student.id;
                    const max = selectedAss?.maxMarks || 100;
                    return (
                      <tr key={sid} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-base">{enr.student.name}</div>
                          <div className="text-xs text-gray-500">{enr.student.rollNo}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <input 
                            type="number"
                            min="0"
                            max={max}
                            value={formGrades[sid] || ""}
                            onChange={(e) => setFormGrades({...formGrades, [sid]: e.target.value})}
                            className="border-2 p-2 rounded w-24 text-center disabled:bg-gray-200"
                            placeholder="---"
                          />
                          <span className="ml-2 text-gray-500">/ {max}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            id={`btn-${sid}`}
                            onClick={() => submitSingleGrade(sid)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-semibold rounded shadow transition"
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {relevantEnrollments.length === 0 && (
                <div className="p-6 text-center text-gray-500">No students are enrolled in this class block.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
