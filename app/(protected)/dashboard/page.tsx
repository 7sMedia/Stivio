"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        const uid = data.session.user.id;
        console.log("✅ Loaded Supabase user ID:", uid);
        setUserId(uid);

        const { data: row } = await supabase
          .from("dropbox_tokens")
          .select("access_token")
          .eq("user_id", uid)
          .maybeSingle();

        if (row?.access_token) {
          setToken(row.access_token);
        }

        setLoading(false);
      }
    });
  }, [router]);

  const connectDropbox = () => {
    if (!userId) {
      alert("User ID not loaded yet");
      return;
    }

    const url = `/api/dropbox/auth?user_id=${encodeURIComponent(userId)}`;
    console.log("🌐 Redirecting to Dropbox:", url);
    window.location.href = url;
  };

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  return (
    <main className="p-6 max-w-[600px] mx-auto space-y-6 text-center">
      <img src="/dropbox-logo.svg" alt="Dropbox" className="h-12 w-12 mx-auto" />
      <h2 className="text-2xl font-semibold">
        {token ? "Dropbox Connected" : "Connect Your Dropbox"}
      </h2>

      <button
        onClick={connectDropbox}
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
      >
        {token ? "Re-connect Dropbox" : "Connect Dropbox"}
      </button>
    </main>
  );
}
