"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Students", href: "/admin/students" },
  { label: "Instructors", href: "/admin/instructors" },
  { label: "Departments", href: "/admin/departments" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Classes", href: "/admin/classes" },
  { label: "Semesters", href: "/admin/semesters" },
  { label: "Enrollments", href: "/admin/enrollments" },
  { label: "Assessments", href: "/admin/assessments" },
  { label: "Marks", href: "/admin/studentmarks" },
  { label: "Attendance", href: "/admin/attendance" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bg-white shadow-md border-r border-gray-200 z-40 transition-transform duration-300 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "calc(100vh - 4rem)", minHeight: "calc(100vh - 4rem)" }}
      >
        <nav className="p-4 space-y-1 h-full overflow-y-auto">
          {adminMenuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-4 py-2 rounded-md text-sm transition ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-700 font-medium hover:text-teal-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay - Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 md:hidden"
        />
      )}
    </>
  );
}
