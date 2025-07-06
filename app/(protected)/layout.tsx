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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user === null) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#101217] text-[#E6E8EB]">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-[#16181f] border-r border-[#2A2C33] flex flex-col justify-between z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Beta7</h2>
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

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="text-white text-3xl focus:outline-none"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-16 md:mt-0 md:ml-64">
        <header className="flex items-center justify-center md:justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#1B1D25] border-b border-[#2A2C33]">
          <h1 className="text-lg font-semibold text-center md:text-left">
            Beta7 Dashboard
          </h1>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
