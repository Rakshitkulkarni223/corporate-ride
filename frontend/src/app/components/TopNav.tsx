"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function TopNav() {
    const { user } = useAuth();
    const pathname = usePathname();

    let title = "Available Rides";

    if (pathname.includes("offers")) {
        title = "My Shared Rides";
    } else if (pathname.includes("requests")) {
        title = "My Requests";
    } else if (pathname.includes("profile")) {
        title = "Profile";
    } else if (pathname.includes("home")) {
        if (user?.isOfferingRides) {
            title = "Ride Requests";
        } else {
            title = "Available Rides";
        }
    }

    return (
        <div className="fixed top-0 left-0 right-0 bg-[#0b2345] border-[1px] z-30 rounded-t-2xl  w-full max-w-lg mx-auto h-13 flex items-center justify-center shadow-sm">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
    );
}
