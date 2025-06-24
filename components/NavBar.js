"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function NavBar({ user }: { user?: any }) {
  const router = useRouter();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-950 to-violet-900 shadow-lg mb-6">
      <div className="text-2xl font-extrabold text-white tracking-tight cursor-pointer" onClick={() => router.push("/")}>
        Beta7
      </div>
      <div className="flex gap-4 items-center">
        <button className="text-indigo-200 hover:text-white transition text-lg" onClick={() => router.push("/dashboard")}>
          Dashboard
        </button>
        <button className="text-indigo-200 hover:text-white transition text-lg" onClick={() => router.push("/ai-tool")}>
          AI Tool
        </button>
        {user ? (
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-indigo-800 text-indigo-200 font-semibold hover:bg-pink-500 hover:text-white transition"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
          >
            Log Out
          </button>
        ) : (
          <button className="ml-4 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold" onClick={() => router.push("/")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
