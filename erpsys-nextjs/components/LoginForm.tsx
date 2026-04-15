"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormProps {
  userType: "admin" | "student";
}

export default function LoginForm({ userType }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint =
        userType === "admin" ? "/api/admin/login" : "/api/student/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Redirect to dashboard
      const dashboardPath = userType === "admin" ? "/admin/dashboard" : "/student/dashboard";
      router.push(dashboardPath);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            {userType === "admin" ? "Admin Portal" : "Student Portal"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {userType === "admin"
              ? "Administrator Login"
              : "Student Management System"}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {userType === "student" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm mb-4">
                Don't have an account?
              </p>
              <Link
                href="/student/register"
                className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg transition duration-200 border border-blue-200"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-teal-600 hover:text-teal-700 text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
