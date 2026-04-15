"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import ProtectedPage from "@/components/ProtectedPage";

interface StudentProfile {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  departmentId: number;
  enrollmentDate: string;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/student/profile");
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
          setUsername(data.data.user?.username || "Student");
        } else {
          router.push("/student/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/student/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar userType="student" username={username} />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Profile</h1>

        {profile ? (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Full Name
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  {profile.name}
                </p>

                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Roll Number
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  {profile.rollNo}
                </p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Email Address
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4 break-all">
                  {profile.email}
                </p>

                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Phone Number
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  {profile.phone || "N/A"}
                </p>
              </div>
            </div>

            <hr className="my-6 sm:my-8" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Department ID
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {profile.departmentId}
                </p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Enrollment Date
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {new Date(profile.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            Failed to load profile. Please try again.
          </div>
        )}
      </div>
      <ChatBot
        title="Help Assistant"
        context="You are helping students with account and profile information. Answer questions about their student profile, contact information, and general assistance."
      />
      </div>
    </ProtectedPage>
  );
}
