"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavButtonProps {
  label: string;
  href: string;
  active: boolean;
}

function NavButton({ label, href, active }: NavButtonProps) {
  return (
    <Link href={href} className="flex-1 text-center">
      <span
        className={`relative inline-block py-2 text-sm font-medium transition-colors duration-300 
          ${active ? "text-[#0b2345]" : "text-gray-500 hover:text-[#0b2345]"}`}
      >
        {label}
        <span
          className={`absolute left-1/2 -bottom-0.5 w-5 h-0.5 rounded-full transform -translate-x-1/2 transition-all duration-300
            ${active ? "bg-[#0b2345] opacity-100" : "opacity-0 group-hover:opacity-50"}`}
        />
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t rounded-b-2xl w-full max-w-lg mx-auto h-13 flex items-center justify-around shadow-sm">
        <>
          {/* <NavButton label="Home" href="/home" active={pathname === "/home"} /> */}
          <NavButton label="Offered Rides" href="/offers" active={pathname === "/offers"} />
          <NavButton label="Ride Requests" href="/requests" active={pathname === "/requests"} />
          <NavButton label="Profile" href="/profile" active={pathname === "/profile"} />
        </>
    </div>
  );
}
