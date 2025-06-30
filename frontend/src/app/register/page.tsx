"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";

export default function Register() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/api/user/register", form);
            if(response.data.success){
                router.replace('/login');
            }
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
                <title>Register</title>
            </Head>


            <div className="h-full w-full flex flex-col justify-center px-4 py-8 ">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                    Create an account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                    </div>

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
                        className="w-full bg-[#0b2345] hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2 cursor-pointer"
                    >
                        Register
                    </button>
                </form>


                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-900 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </>
    );
}
