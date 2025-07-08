"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/");
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

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDropboxDisconnect = async () => {
    if (!userId) return;
    setDisconnecting(true);

    const res = await fetch("/api/dropbox/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    setDisconnecting(false);
    if (res.ok) {
      alert("Disconnected Dropbox.");
      setToken(null);
    } else {
      alert("Failed to disconnect Dropbox.");
    }
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

      <DropboxConnectButton userId={userId} />

      {token && (
        <Button
          variant="destructive"
          onClick={handleDropboxDisconnect}
          disabled={disconnecting}
          className="w-full"
        >
          {disconnecting ? "Disconnecting..." : "Disconnect Dropbox"}
        </Button>
      )}

      <Button
        variant="secondary"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </Button>
    </main>
  );
}
