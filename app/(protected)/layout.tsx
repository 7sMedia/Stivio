"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/TopBar"; // Ensure this exists

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
