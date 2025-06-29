"use client";

import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function AuthInitializer() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axiosInstance.post("/api/auth/refresh");
        const { token, expires, ...user } = response.data.data;
        login(user, token, expires);
      } catch (error) {
          router.replace("/login");
      }
    };

    refreshToken();
  }, [login]);

  return null;
}