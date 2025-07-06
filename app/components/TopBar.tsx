// app/components/TopBar.tsx
"use client";

import { Bell } from "lucide-react";

interface TopBarProps {
  user: { email: string };
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#181a20] border-b border-[#23242d] h-16 flex items-center px-8 ml-60">
      <div className="flex-1" />
      <div className="flex gap-3 items-center">
        <button className="relative p-2 rounded hover:bg-[#23242d]">
          <Bell className="w-5 h-5 text-[#b1b2c1]" />
        </button>
        <span className="text-[#b1b2c1] opacity-80 text-sm">{user.email}</span>
        <button
          className="bg-[#22232a] px-3 py-1.5 rounded text-xs hover:bg-[#35364a] text-[#b1b2c1]"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
