"use client";
import { Bell, Menu } from "lucide-react";

interface TopBarProps {
  user: { email: string };
  onLogout: () => void;
  onMenuToggle: () => void;
}

export default function TopBar({
  user,
  onLogout,
  onMenuToggle,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center bg-[#181a20] border-b border-[#23242d] h-16 px-4 sm:px-8">
      {/* Hamburger on mobile */}
      <button
        className="p-2 text-[#b1b2c1] sm:hidden"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-[#23242d]">
          <Bell className="w-5 h-5 text-[#b1b2c1]" />
        </button>
        <span className="text-[#b1b2c1] text-sm opacity-80">
          {user.email}
        </span>
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
