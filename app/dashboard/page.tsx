"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [dropboxStatus, setDropboxStatus] = useState<{ connected: boolean; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/");
      }
    };
    getUser();
  }, [router]);

  // Listen for postMessage from popup
  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.data?.type === "dropbox-connected") {
        window.location.reload();
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Fetch Dropbox connection status
  useEffect(() => {
    async function fetchDropboxStatus() {
      if (!user) return;
      const res = await fetch(`/api/dropbox/status?user_id=${user.id}`);
      const data = await res.json();
      setDropboxStatus(data);
    }
    fetchDropboxStatus();
  }, [user]);

  function openDropboxOAuthPopup(userId: string) {
    const width = 520;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `/api/dropbox/auth?user_id=${userId}`;
    const popup = window.open(
      url,
      "dropbox-oauth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes`
    );
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 700);
  }

  // Handle disconnect Dropbox
  async function handleDisconnectDropbox() {
    if (!user?.id) return;
    const res = await fetch("/api/dropbox/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) {
      setDropboxStatus({ connected: false });
      window.location.reload();
    } else {
      alert("Failed to disconnect Dropbox.");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-black px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Dropbox Automation Demo</h1>
      {dropboxStatus && dropboxStatus.connected ? (
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center text-green-400 font-semibold">
            <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"></path></svg>
            Connected as {dropboxStatus.email}
          </span>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 ml-3"
            onClick={handleDisconnectDropbox}
          >
            Disconnect Dropbox
          </button>
        </div>
      ) : (
        user && user.id && (
          <button
            className="mb-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-md"
            onClick={() => openDropboxOAuthPopup(user.id)}
          >
            <span className="inline-block mr-2 align-middle">
              <img src="/dropbox-logo.svg" alt="Dropbox" className="w-5 h-5 inline-block" />
            </span>
            Connect Dropbox (Auto Sync)
          </button>
        )
      )}
      {/* Add your automation UI/buttons here! */}
    </div>
  );
}
