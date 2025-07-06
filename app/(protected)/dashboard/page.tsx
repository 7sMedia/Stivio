// app/dashboard/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import DropboxFileList from "@components/DropboxFileList";
import DropboxFolderPicker from "@components/DropboxFolderPicker";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [importedFile, setImportedFile] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [pickedFolder, setPickedFolder] = useState<string | null>(null);
  const [dropboxStatus, setDropboxStatus] = useState<{ connected: boolean; email?: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.data?.type === "dropbox-connected") {
        window.location.reload();
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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

  useEffect(() => {
    async function fetchDropboxStatus() {
      if (!user) return;
      const res = await fetch(`/api/dropbox/status?user_id=${user.id}`);
      const data = await res.json();
      setDropboxStatus(data);
    }
    fetchDropboxStatus();
  }, [user]);

  async function handleProcessFile(file: any) {
    setImporting(true);
    setImportError(null);
    setImportedFile(null);
    try {
      const res = await fetch("/api/dropbox/process-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          file
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setImportedFile(file);
      } else {
        setImportError(result.error || "Failed to import file.");
      }
    } catch (e) {
      setImportError("Network error importing file.");
    }
    setImporting(false);
  }

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
      <div className="min-h-screen flex items-center justify-center text-2xl text-[#b1b2c1] bg-[#141518]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Welcome/User card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="card flex flex-col justify-center items-start min-h-[340px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-br from-[#4339ce22] to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 mb-6 z-10">
            <UserIcon size={44} className="text-[#c3bfff]" />
            <div>
              <h1 className="text-2xl font-bold mb-1 tracking-tight text-white">Welcome back!</h1>
              <div className="text-[#b1b2c1] font-medium">{user.email}</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-6 z-10">
            {dropboxStatus && dropboxStatus.connected ? (
              <span className="flex items-center text-green-400 font-semibold bg-[#232e23] px-3 py-1.5 rounded">
                <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"></path></svg>
                Connected as {dropboxStatus.email}
                <button
                  className="ml-4 px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                  onClick={handleDisconnectDropbox}
                >
                  Disconnect
                </button>
              </span>
            ) : (
              user && user.id && (
                <button
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-md"
                  style={{ display: "inline-block" }}
                  onClick={() => openDropboxOAuthPopup(user.id)}
                >
                  <img src="/dropbox-logo.svg" alt="Dropbox" className="inline-block w-5 h-5 mr-2 align-text-bottom" />
                  Connect Dropbox (Auto Sync)
                </button>
              )
            )}
            <button
              className="px-6 py-2 rounded-lg bg-[#23242d] hover:bg-pink-600 text-[#b1b2c1] font-semibold transition"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
            >
              Log Out
            </button>
          </div>
          <div className="w-full z-10">
            <div className="font-semibold text-base mb-2 text-[#b1b2c1]">Your Latest Videos</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#1e1e28] aspect-video flex items-center justify-center text-[#c3bfff] font-bold text-lg shadow-inner border border-[#23242d]">Video 1</div>
              <div className="rounded-lg bg-[#1e1e28] aspect-video flex items-center justify-center text-[#c3bfff] font-bold text-lg shadow-inner border border-[#23242d]">Video 2</div>
            </div>
          </div>
        </motion.div>

        {/* Dropbox Folder Picker */}
        <div className="card flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-white">Dropbox Folder Picker</h2>
          <DropboxFolderPicker
            userId={user.id}
            onFolderPick={(folderPath) => {
              setPickedFolder(folderPath);
              alert(`You picked folder: ${folderPath}`);
            }}
            onFilePick={file => handleProcessFile(file)}
          />
          {pickedFolder && (
            <div className="mt-4 text-[#4ad1fa] text-xs">
              Selected folder: <span className="font-mono">{pickedFolder}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dropbox File List */}
      <div className="card mt-4">
        <h2 className="text-xl font-bold mb-4 text-white">Your Dropbox Files (Root)</h2>
        <DropboxFileList userId={user.id} onProcessFile={handleProcessFile} />
        {importing && (
          <div className="mt-4 text-[#b1b2c1]">Importing file...</div>
        )}
        {importedFile && !importError && (
          <div className="mt-6 p-4 bg-green-900/60 rounded-xl text-green-300 font-bold">
            Imported: {importedFile.name}
          </div>
        )}
        {importError && (
          <div className="mt-6 p-4 bg-red-900/60 rounded-xl text-red-300 font-bold">
            {importError}
          </div>
        )}
      </div>
    </div>
  );
}
