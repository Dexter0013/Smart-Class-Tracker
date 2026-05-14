"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, createContext, useContext } from "react";

interface NavbarProps {
  userType: "admin" | "student" | "instructor";
  username: string;
  onSidebarToggle?: () => void;
}

// Create context for sidebar toggle
const SidebarContext = createContext<{ toggleSidebar: () => void } | null>(null);
export const useSidebarToggle = () => useContext(SidebarContext);

export default function Navbar({ userType, username }: NavbarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("username");
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks =
    userType === "admin"
      ? [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/chat", label: "Assistant" },
        ]
      : userType === "instructor"
      ? [
          { href: "/instructor/dashboard", label: "Dashboard" },
          { href: "/instructor/enrollments", label: "Enrollments" },
          { href: "/instructor/assessments", label: "Assessments" },
          { href: "/instructor/marks", label: "Marks" },
          { href: "/instructor/attendance", label: "Attendance" },
          { href: "/instructor/chat", label: "Assistant" },
        ]
      : [
          { href: "/student/dashboard", label: "Dashboard" },
          { href: "/student/courses", label: "My Courses" },
          { href: "/student/grades", label: "Grades" },
          { href: "/student/attendance", label: "Attendance" },
          { href: "/student/profile", label: "Profile" },
          { href: "/student/chat", label: "Assistant" },
        ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 gap-2">
          <Link
            href={
              userType === "admin" ? "/admin/dashboard" : userType === "instructor" ? "/instructor/dashboard" : "/student/dashboard"
            }
            className="text-2xl font-bold text-teal-600 whitespace-nowrap"
          >
            <span className="hidden sm:inline text-gray-800">ERP System</span>
            <span className="sm:hidden text-gray-800">ERP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:text-teal-600 hover:bg-gray-50 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transform transition ${isMobileMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* User Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold text-gray-800 hover:text-teal-600 hover:bg-gray-50 transition whitespace-nowrap min-w-max"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs text-gray-800">
                {username}
              </span>
              <svg
                className={`w-4 h-4 transform transition ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                <Link
                  href={
                    userType === "admin" ? "/admin/dashboard" : userType === "instructor" ? "/instructor/dashboard" : "/student/profile"
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile User Menu */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 px-2 py-2 rounded-md text-xs font-semibold text-gray-800 hover:text-teal-600 hover:bg-gray-50 transition"
              title={username}
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-24 text-gray-800">
                {username}
              </span>
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-2">
                <Link
                  href={
                    userType === "admin" ? "/admin/dashboard" : userType === "instructor" ? "/instructor/dashboard" : "/student/profile"
                  }
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:text-teal-600 hover:bg-gray-50 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
