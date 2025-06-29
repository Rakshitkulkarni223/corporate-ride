"use client";

import { useState } from "react";
import Head from "next/head";

export default function LoginPage() {
  const [form, setForm] = useState({
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", form);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login to Your Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}