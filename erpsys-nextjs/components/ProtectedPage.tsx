"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkAuthAction } from "@/app/actions";

interface ProtectedPageProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "STUDENT";
}

export default function ProtectedPage({
  children,
  requiredRole,
}: ProtectedPageProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await checkAuthAction();
        
        if (!user) {
          router.push(requiredRole === "ADMIN" ? "/admin/login" : "/student/login");
          return;
        }

        if (requiredRole && user.role !== requiredRole) {
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, router]);



  return <>{children}</>;
}
