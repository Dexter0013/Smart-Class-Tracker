"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ProtectedPageProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "STUDENT";
}

export default function ProtectedPage({ children, requiredRole }: ProtectedPageProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For admin pages
        if (requiredRole === "ADMIN") {
          const response = await fetch("/api/admin/dashboard/stats", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            setIsAuthorized(true);
          } else {
            router.push("/admin/login");
          }
        }
        // For student pages
        else if (requiredRole === "STUDENT") {
          const response = await fetch("/api/student/profile", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            setIsAuthorized(true);
          } else {
            router.push("/student/login");
          }
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (requiredRole === "ADMIN") {
          router.push("/admin/login");
        } else if (requiredRole === "STUDENT") {
          router.push("/student/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
