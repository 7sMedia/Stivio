"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DropboxConnectButton from "@/components/DropboxConnectButton";

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

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  return (
    <main className="p-6 max-w-[600px] mx-auto space-y-6 text-center">
      <img src="/dropbox-logo.svg" alt="Dropbox" className="h-12 w-12 mx-auto" />
      <h2 className="text-2xl font-semibold">
        {token ? "Dropbox Connected" : "Connect Your Dropbox"}
      </h2>

      <DropboxConnectButton />
    </main>
  );
}
