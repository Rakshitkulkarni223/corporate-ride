"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { IoArrowBack } from "react-icons/io5";

export default function TopNav() {
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    let title = "Available Rides";
    let showBackButton = false;

    if (pathname.includes("/offers/") && pathname.includes("/requests")) {
        title = "Ride Requests";
        showBackButton = true;
    } else if (pathname.includes("/offers")) {
        title = "Offered Rides";
    } else if (pathname.includes("/requests")) {
        title = "My Requests";
    } else if (pathname.includes("/profile")) {
        title = "Profile";
    }

    return (
        <div className="fixed top-0 left-0 right-0 bg-[#0b2345] border z-30 rounded-t-2xl w-full max-w-lg mx-auto h-13 flex items-center justify-center shadow-sm px-4">
            {showBackButton && (
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 text-white text-xl hover:text-gray-300 transition"
                    aria-label="Go back"
                >
                    <IoArrowBack />
                </button>
            )}
            <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
    );
}
