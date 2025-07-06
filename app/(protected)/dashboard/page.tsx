// app/(protected)/dashboard/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import DropboxFileList from "@components/DropboxFileList";
import DropboxFolderPicker from "@components/DropboxFolderPicker";
import DropboxImageUploader from "@components/DropboxImageUploader";
import UserGeneratedVideos from "@components/UserGeneratedVideos";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [pickedFolder, setPickedFolder] = useState<string | null>(null);
  const [dropboxStatus, setDropboxStatus] = useState<{ connected: boolean; email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.data?.type === "dropbox-connected") {
        window.location.reload();
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/dropbox/status?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setDropboxStatus(data));
  }, [user]);

  function openDropboxOAuthPopup(userId: string) {
    const width = 520, height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `/api/dropbox/auth?user_id=${userId}`,
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

  async function handleDisconnectDropbox() {
    if (!user?.id) return;
    const res = await fetch("/api/dropbox/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) window.location.reload();
    else alert("Failed to disconnect Dropbox.");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-[#b1b2c1] bg-[#141518]">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f11] text-white px-4 md:px-6 py-6 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Welcome & Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="xl:col-span-3 bg-[#1a1b1e] rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center gap-4 mb-6">
            <UserIcon size={44} className="text-[#c3bfff]" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back!</h1>
              <p className="text-[#b1b2c1] font-medium break-all">{user.email}</p>
            </div>
          </div>

          {dropboxStatus?.connected ? (
            <div className="flex flex-wrap items-center text-green-400 font-semibold bg-[#232e23] px-4 py-2 rounded-lg mb-6">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"/>
              </svg>
              Connected as {dropboxStatus.email}
              <button
                className="ml-4 px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleDisconnectDropbox}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => openDropboxOAuthPopup(user.id)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition mb-6"
            >
              <img src="/dropbox-logo.svg" alt="Dropbox" className="inline-block w-5 h-5 mr-2 align-text-bottom" />
              Connect Dropbox (Auto Sync)
            </button>
          )}

          <DropboxImageUploader userId={user.id} />

          <div className="mt-8">
            <UserGeneratedVideos userId={user.id} />
          </div>
        </motion.div>

        {/* Folder Picker */}
        <div className="xl:col-span-2 bg-[#1a1b1e] rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Dropbox Folder Picker</h2>
          <DropboxFolderPicker
            userId={user.id}
            onFolderPick={(folderPath) => {
              setPickedFolder(folderPath);
              alert(`You picked folder: ${folderPath}`);
            }}
          />
          {pickedFolder && (
            <div className="mt-4 text-[#4ad1fa] text-xs break-all">
              Selected folder: <span className="font-mono">{pickedFolder}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
