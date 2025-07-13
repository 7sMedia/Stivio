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
  { name: "Prompt Templates", href: "/prompt-templates", icon: Sparkles },
  { name: "Manual Mode", href: "/manual", icon: PenTool },
  { name: "History", href: "/history", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "AI Tool", href: "/ai-tool", icon: Sparkles }, // ✅ NEW LINK
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 h-screen bg-background border-r border-zinc-800 text-white">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Top Brand */}
        <div className="text-2xl font-bold mb-8 tracking-tight">Beta7</div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold border-l-4 border-sky-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? "text-sky-400"
                      : "text-zinc-500 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 mt-auto border-t border-zinc-700">
          <Link
            href="/logout"
            className="flex items-center px-3 py-2 mt-4 text-sm font-medium text-zinc-400 rounded-md hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
