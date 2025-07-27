"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      setIsLoading(false);
      router.replace('/login');
    }
  }, [isAuthenticated, token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : null}
    </div>
  );
}
