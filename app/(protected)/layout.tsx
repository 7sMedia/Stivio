// app/(protected)/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
      else setUser(data.session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.replace("/");
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false); // auto-close sidebar on route change
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user === null) return null;

  return (
    <div className="min-h-screen flex bg-[#101217] text-[#E6E8EB] relative">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full w-64 bg-[#16181f] border-r border-[#2A2C33] flex flex-col justify-between z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Beta7</h2>
          <nav className="space-y-2 text-sm">
            <a
              href="/dashboard"
              className={`block px-2 py-1 rounded ${
                pathname === "/dashboard"
                  ? "bg-[#0EC9DB]/20 text-white"
                  : "text-[#b1b2c1] hover:text-white"
              }`}
            >
              Dashboard
            </a>
            <a
              href="/ai-tool"
              className={`block px-2 py-1 rounded ${
                pathname === "/ai-tool"
                  ? "bg-[#0EC9DB]/20 text-white"
                  : "text-[#b1b2c1] hover:text-white"
              }`}
            >
              AI Tool
            </a>
          </nav>
        </div>
        <div className="p-6 border-t border-[#2A2C33] text-sm">
          <div className="mb-2 text-[#7e7f88] truncate">{user.email}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border border-[#0EC9DB] rounded hover:bg-[#0EC9DB]/10 transition w-full"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#1B1D25] border-b border-[#2A2C33]">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on mobile */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Toggle Sidebar"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white">🔥 Beta7 Dashboard 🔥</h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
 
