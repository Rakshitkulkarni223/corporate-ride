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
        className={`block py-2 text-sm font-medium ${
          active ? "text-blue-900 underline underline-offset-4" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const role = pathname.startsWith("/offers") ? "rider" : "user";

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t rounded-b-2xl w-full max-w-lg mx-auto h-13 flex items-center justify-around shadow-sm">
      {role === "rider" ? (
        <>
          <NavButton label="Home" href="/home" active={pathname === "/home"} />
          <NavButton label="My Offers" href="/offers" active={pathname === "/offers"} />
          <NavButton label="Profile" href="/profile" active={pathname === "/profile"} />
        </>
      ) : (
        <>
          <NavButton label="Home" href="/home" active={pathname === "/home"} />
          <NavButton label="My Requests" href="/requests" active={pathname === "/requests"} />
          <NavButton label="Profile" href="/profile" active={pathname === "/profile"} />
        </>
      )}
    </div>
  );
}
