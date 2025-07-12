"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";

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
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">{children}</main>
    </div>
  );
}
