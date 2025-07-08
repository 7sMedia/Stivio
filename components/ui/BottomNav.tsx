"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wand2 } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full border-t border-[#2A2C33] bg-[#16181f] md:hidden z-50">
      <ul className="flex justify-around items-center text-sm text-white">
        <li>
          <Link
            href="/dashboard"
            className={`flex flex-col items-center p-2 ${
              pathname === "/dashboard" ? "text-accent" : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/ai-tool"
            className={`flex flex-col items-center p-2 ${
              pathname === "/ai-tool" ? "text-accent" : "text-gray-400"
            }`}
          >
            <Wand2 className="w-5 h-5" />
            <span>AI Tool</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
