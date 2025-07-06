// app/(protected)/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1) Check current session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        // not signed in → back to public home
        router.replace("/");
      } else {
        setUser(data.session.user);
      }
    });

    // 2) Listen for sign-in / sign-out events
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace("/");
      } else {
        setUser(session.user);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // 3) Log out handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // supabase clears the cookie; the listener above will redirect to "/"
  };

  // While we’re waiting for the session to load, don’t render anything
  if (user === null) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#101217] text-[#E6E8EB]">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1B1D25] border-b border-[#2A2C33]">
        <div className="text-lg font-semibold">Beta7 Dashboard</div>
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

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
