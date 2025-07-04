"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import NavBar from "@components/NavBar";
import ProgressBar from "@components/ProgressBar";
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

  // Called when user clicks "Import/Process" on a Dropbox file
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
    <>
      <NavBar user={user} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-black px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="w-full max-w-2xl bg-indigo-900/90 rounded-3xl shadow-2xl border border-indigo-700/40 p-10 flex flex-col items-center relative"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-0"
            style={{ width: 350, height: 180 }}
          >
            <svg width="350" height="180" viewBox="0 0 350 180" fill="none">
              <defs>
                <radialGradient id="g2" cx="50%" cy="50%" r="80%">
                  <stop stopColor="#818cf8" stopOpacity="0.65" />
                  <stop offset="0.7" stopColor="#f472b6" stopOpacity="0.29" />
                  <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.14" />
                </radialGradient>
              </defs>
              <ellipse cx="175" cy="90" rx="160" ry="70" fill="url(#g2)" />
            </svg>
          </motion.div>
          <div className="relative z-10 flex flex-col items-center">
            {/* DEBUG: Log user object */}
            {console.log("user in dashboard", user)}

            <UserIcon size={42} className="text-indigo-100 mb-2 drop-shadow-xl" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl mb-2 font-display">
              Welcome back!
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-indigo-300 text-lg mb-6 font-semibold"
            >
              {user.email}
            </motion.div>

            {/* --- Dropbox status & connect/disconnect buttons --- */}
            {dropboxStatus && dropboxStatus.connected ? (
              <div className="flex items-center gap-3 mb-2">
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
              // Only render button if user and user.id are present
              user && user.id && (
                <a
                  href={`/api/dropbox/auth?user_id=${user.id}`}
                  className="mb-3 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-md"
                  style={{ display: "inline-block" }}
                >
                  <span role="img" aria-label="dropbox" className="mr-2">
                    <img src="/dropbox-logo.svg" alt="Dropbox" className="inline-block w-5 h-5 align-text-bottom" />
                  </span>
                  Connect Dropbox (Auto Sync)
                </a>
              )
            )}

            <button
              className="mt-2 px-6 py-2 rounded-lg bg-indigo-800 text-indigo-200 font-semibold shadow hover:bg-pink-500 hover:text-white transition"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
            >
              Log Out
            </button>
            <div className="w-full mt-3">
              <div className="text-indigo-200 text-xl font-semibold mb-2">
                Your Latest Videos
              </div>
              {/* Placeholder thumbnails, can replace with actual history */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-indigo-800/60 aspect-video flex items-center justify-center text-indigo-300 font-bold text-xl shadow-inner">
                  Video 1
                </div>
                <div className="rounded-xl bg-indigo-800/60 aspect-video flex items-center justify-center text-indigo-300 font-bold text-xl shadow-inner">
                  Video 2
                </div>
              </div>
              {/* End placeholder */}
            </div>
          </div>
        </motion.div>

        {/* ---- Dropbox Folder Picker BELOW welcome box ---- */}
        <div className="w-full max-w-2xl mt-10 bg-indigo-900/80 rounded-3xl shadow-2xl border border-indigo-700/40 p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4">Dropbox Folder Picker</h2>
          <DropboxFolderPicker
            userId={user.id}
            onFolderPick={(folderPath) => {
              setPickedFolder(folderPath);
              // Optionally: save to DB as their automation folder
              alert(`You picked folder: ${folderPath}`);
            }}
            onFilePick={file => handleProcessFile(file)}
          />
          {pickedFolder && (
            <div className="mt-4 text-sky-200 text-sm">
              Selected folder for automation: <span className="font-mono">{pickedFolder}</span>
            </div>
          )}
        </div>

        {/* ---- Dropbox File List BELOW folder picker ---- */}
        <div className="w-full max-w-2xl mt-6 bg-indigo-900/80 rounded-3xl shadow-2xl border border-indigo-700/40 p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Dropbox Files (Root)</h2>
          <DropboxFileList userId={user.id} onProcessFile={handleProcessFile} />
          {importing && (
            <div className="mt-4 text-indigo-100">Importing file...</div>
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
    </>
  );
}
