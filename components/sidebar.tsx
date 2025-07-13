"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Settings,
  Video,
  Sparkles,
  PenTool,
  Clock,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Video },
  { name: "AI Tool", href: "/ai-tool", icon: Sparkles },
  { name: "Manual Mode", href: "/manual", icon: PenTool },
  { name: "History", href: "/history", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 h-screen bg-background border-r border-zinc-800 text-white">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Top Brand */}
        <div className="text-2xl font-bold text-white mb-8">Beta7</div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-zinc-800 ${
                  isActive ? "bg-zinc-800" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Link
            href="/logout"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
