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
    let active = true;

    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          router.replace("/");
          return;
        }

        const uid = data.session.user.id;
        console.log("✅ Loaded Supabase user ID:", uid);
        if (!active) return;

        setUserId(uid);

        const { data: row } = await supabase
          .from("dropbox_tokens")
          .select("access_token")
          .eq("user_id", uid)
          .maybeSingle();

        if (row?.access_token) {
          setToken(row.access_token);
        }
      } catch (err) {
        console.error("🔴 Supabase auth load failed:", err);
        router.replace("/");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
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
      alert("✅ Disconnected Dropbox.");
      setToken(null);
    } else {
      alert("❌ Failed to disconnect Dropbox.");
    }
  };

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading dashboard...</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Welcome to Beta7 Dashboard</h2>

      <DropboxConnectButton userId={userId} />

      {token && (
        <div className="mt-6 flex flex-col gap-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDropboxDisconnect}
            disabled={disconnecting}
          >
            {disconnecting ? "Disconnecting..." : "Disconnect Dropbox"}
          </Button>
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="outline"
          className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </main>
  );
}
