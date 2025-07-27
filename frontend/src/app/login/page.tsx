"use client";

import { useState } from "react";
import Head from "next/head";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { CONSTANTS } from "../utils/constants";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const { login, setAuthStatus } = useAuth()
    const [form, setForm] = useState({
        mobileNumber: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Set pending state first
            setAuthStatus(CONSTANTS.AUTH_STATUS.PENDING);
            
            try {
                // Login API call
                const response = await axiosInstance.post("/api/auth/login", form);
                
                try {
                    // Extract data from response
                    const { token, expires, ...user } = response.data.data;
                    
                    // Update auth context
                    login(user, token, expires);
                    setAuthStatus(CONSTANTS.AUTH_STATUS.SUCCESS);
                    
                    // Navigate after successful login with a small delay
                    // to ensure state updates are complete
                    setTimeout(() => {
                        try {
                            router.replace('/home');
                        } catch (navError) {
                            console.error("Navigation error:", navError);
                        }
                    }, 100);
                } catch (dataError) {
                    console.error("Error processing login data:", dataError);
                    alert("Error processing login data. Please try again.");
                    setAuthStatus(CONSTANTS.AUTH_STATUS.FAIL);
                }
            } catch (err: any) {
                // API error handling
                try {
                    if (err.response) {
                        console.log("Error response:", err.response.data);
                        alert(err.response.data.message || "Invalid credentials or server error");
                    } else {
                        console.log("Network or other error:", err.message);
                        alert("Network error or server not reachable");
                    }
                    setAuthStatus(CONSTANTS.AUTH_STATUS.FAIL);
                } catch (alertError) {
                    console.error("Error displaying alert:", alertError);
                }
            }
        } catch (outerError) {
            console.error("Unexpected error in form submission:", outerError);
            try {
                alert("An unexpected error occurred");
                setAuthStatus(CONSTANTS.AUTH_STATUS.FAIL);
            } catch (finalError) {
                console.error("Error in final error handler:", finalError);
            }
        }
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <div className="h-full w-full flex flex-col justify-center px-4 py-8 ">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            id="mobileNumber"
                            value={form.mobileNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter mobile number"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0b2345] hover:bg-blue-950 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-900 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </>
    );
}
