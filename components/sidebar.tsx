"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings, Video } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Video },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 h-screen px-4 py-6 border-r lg:block dark:border-zinc-800">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-6 text-xl font-bold text-white">
          Beta7
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <form
          action="/logout"
          method="post"
          className="mt-auto"
        >
          <button
            type="submit"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
