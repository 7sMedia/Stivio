"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import NavBar from "@components/NavBar";
import ProgressBar from "@components/ProgressBar";
import DropboxFileList from "@components/DropboxFileList"; // <- Add this import!

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [importedFile, setImportedFile] = useState<any>(null);
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

  // Called when user clicks "Import/Process" on a Dropbox file
  async function handleProcessFile(file: any) {
    setImportedFile(file);
    alert(`Queued ${file.name} for processing!`);
    // Replace with actual backend POST if you want to trigger automation
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
            <button
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold shadow-lg text-xl hover:from-sky-400 hover:to-fuchsia-500 transition mb-6"
              onClick={() => router.push("/ai-tool")}
            >
              🚀 Start New AI Video
            </button>
            {/* Connect Dropbox anchor tag */}
            <a
              href={`/api/dropbox/auth?user_id=${user.id || user.user_id || user.sub || ""}`}
              className="mb-3 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-md"
              style={{ display: "inline-block" }}
            >
              <span role="img" aria-label="dropbox" className="mr-2">
                <img src="/dropbox-logo.svg" alt="Dropbox" className="inline-block w-5 h-5 align-text-bottom" />
              </span>
              Connect Dropbox (Auto Sync)
            </a>
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
        {/* ---- Dropbox File Picker BELOW welcome box ---- */}
        <div className="w-full max-w-2xl mt-10 bg-indigo-900/80 rounded-3xl shadow-2xl border border-indigo-700/40 p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Dropbox Files</h2>
          <DropboxFileList userId={user.id} onProcessFile={handleProcessFile} />
          {importedFile && (
            <div className="mt-6 p-4 bg-green-900/60 rounded-xl text-green-300 font-bold">
              Imported: {importedFile.name}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
