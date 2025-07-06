// app/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.replace("/");    // go back to landing
    }
    signOut();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <p className="text-lg">Signing you out…</p>
    </div>
  );
}
