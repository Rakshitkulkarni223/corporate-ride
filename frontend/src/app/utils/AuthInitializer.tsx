"use client";

import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "./constants";

export default function AuthInitializer() {
  const router = useRouter();
  const { login, setAuthStatus } = useAuth();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axiosInstance.post("/api/auth/refresh");
        const { token, expires, ...user } = response.data.data;
        login(user, token, expires);
        setAuthStatus(CONSTANTS.AUTH_STATUS.SUCCESS);
      } catch (error) {
        router.replace("/login");
      }
    };

    refreshToken();
  }, [login]);

  return null;
}