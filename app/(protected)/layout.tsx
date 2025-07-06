// app/(protected)/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/");
      } else {
        setUser(data.session.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace("/");
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user === null) return null;

  return (
    <div className="min-h-screen flex bg-[#101217] text-[#E6E8EB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#16181f] border-r border-[#2A2C33] flex flex-col justify-between">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Beta7</h2>
          <nav className="space-y-2 text-sm">
            <a href="/dashboard" className="block text-[#b1b2c1] hover:text-white">
              Dashboard
            </a>
            <a href="/ai-tool" className="block text-[#b1b2c1] hover:text-white">
              AI Tool
            </a>
            {/* Add more links here */}
          </nav>
        </div>
        <div className="p-6 border-t border-[#2A2C33] text-sm">
          <div className="mb-2 text-[#7e7f88]">{user.email}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border border-[#0EC9DB] rounded hover:bg-[#0EC9DB]/10 transition w-full"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-[#1B1D25] border-b border-[#2A2C33]">
          <h1 className="text-lg font-semibold">Beta7 Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
