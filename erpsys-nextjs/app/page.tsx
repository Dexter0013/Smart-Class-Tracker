import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "ERP System - Student Management",
};

interface PortalCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  linkHref: string;
  linkText: string;
  theme: "blue" | "teal" | "indigo";
}

function PortalCard({
  title,
  description,
  icon,
  features,
  linkHref,
  linkText,
  theme,
}: PortalCardProps) {
  const isBlue = theme === "blue";

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
      <div className="mb-6">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
            isBlue ? "bg-blue-100 text-blue-600" : theme === "indigo" ? "bg-indigo-100 text-indigo-600" : "bg-teal-100 text-teal-600"
          }`}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <ul className="space-y-2 mb-6 text-sm text-gray-600">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center">
            <span className="mr-2">✓</span> {feature}
          </li>
        ))}
      </ul>

      <Link
        href={linkHref}
        className={`block w-full font-semibold py-3 px-4 rounded-lg text-center transition text-white ${
          isBlue
            ? "bg-blue-600 hover:bg-blue-700"
            : theme === "indigo"
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {linkText}
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Educational Resource Planning System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline academic operations with our comprehensive student
            management and course administration platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Admin Portal */}
          <PortalCard
            title="Administrator"
            description="Manage students, courses, and faculty"
            theme="blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            }
            features={[
              "Student Management",
              "Course Administration",
              "Faculty Management",
              "System Reports",
            ]}
            linkHref="/admin/login"
            linkText="Admin Login"
          />

          {/* Student Portal */}
          <PortalCard
            title="Student"
            description="Access courses and view your academic records"
            theme="teal"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.228 6.228 2 10.228 2 15s4.228 8.772 10 8.772 10-4.228 10-8.772C22 10.228 17.772 6.228 12 6.253z"
                />
              </svg>
            }
            features={[
              "View Enrolled Courses",
              "Check Grades",
              "Track Attendance",
              "Personal Profile",
            ]}
            linkHref="/student/login"
            linkText="Student Login"
          />

          {/* Instructor Portal */}
          <PortalCard
            title="Instructor"
            description="Manage your classes, enrollments, and grades"
            theme="indigo"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            }
            features={[
              "Class Enrollments",
              "Manage Assessments",
              "Grade Students",
              "Track Class Stats",
            ]}
            linkHref="/instructor/login"
            linkText="Instructor Login"
          />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold text-gray-900">Course Management</h4>
              <p className="text-sm text-gray-600 mt-2">
                Organize and manage courses efficiently
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900">
                Performance Tracking
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Monitor grades and academic progress
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900">Secure Access</h4>
              <p className="text-sm text-gray-600 mt-2">
                Protected login for all users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
