"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/TopBar"; // Make sure TopBar.tsx is created

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar (left) */}
      <Sidebar />

      {/* Main content with TopBar */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
