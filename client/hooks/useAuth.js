"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        await verifyToken();
        setChecking(false)
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
    };
    checkAuth();
  }, []);

  return { checking };
}
