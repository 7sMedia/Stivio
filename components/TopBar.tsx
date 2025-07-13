"use client";

import { Search, UserCircle2 } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-zinc-700 shadow-lg rounded-b-xl">
      {/* Search bar */}
      <div className="flex items-center space-x-2 bg-[#2a2a2a] px-3 py-2 rounded-lg w-full max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search prompts, videos, or files..."
          className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-full"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center space-x-4">
        <button className="bg-primary hover:opacity-90 transition text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md">
          + Create
        </button>
        <UserCircle2 size={32} className="text-white hover:text-accent transition" />
      </div>
    </header>
  );
}
