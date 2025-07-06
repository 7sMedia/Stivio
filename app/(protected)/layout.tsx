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
    // 1) On mount: check current session
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/");     // no session → back to public landing
      } else {
        setUser(data.session.user);
      }
    });

    // 2) Listen for sign-in / sign-out events
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace("/");     // signed out → back to public landing
      } else {
        setUser(session.user);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  // 3) Log out button
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // the listener above will redirect to "/"
  };

  // 4) Don’t render the protected UI until we know who the user is
  if (user === null) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#101217] text-[#E6E8EB]">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1B1D25] border-b border-[#2A2C33]">
        <h1 className="text-lg font-semibold">Beta7 Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm border border-[#0EC9DB] rounded hover:bg-[#0EC9DB]/10 transition"
          >
            Log Out
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
