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
            const response = await axiosInstance.post("/api/auth/login", form);
            const { token, expires, ...user } = response.data.data;
            login(user, user.token, user.expires);
            setAuthStatus(CONSTANTS.AUTH_STATUS.SUCCESS);
            router.replace('/home');
        } catch (err: any) {
            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
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
