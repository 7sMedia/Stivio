"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      setTimeout(() => {
        router.replace("/"); // Redirect after delay
      }, 1500); // 1.5 seconds
    }
    signOut();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-white">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">Beta7</h1>
        <p className="text-sm text-muted-foreground animate-pulse">Signing you out…</p>
      </div>
    </div>
  );
}
