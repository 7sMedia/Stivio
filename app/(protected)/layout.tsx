// app/(protected)/layout.tsx
"use client";
import "../styles/globals.css";
import { ReactNode, useState } from "react";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = { email: "jay7nyc@hotmail.com" };

  return (
    <html lang="en">
      <body className="flex bg-[#141518] text-white min-h-screen">
        {/* Sidebar Drawer */}
        <Sidebar
          user={user}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col">
          <TopBar
            user={user}
            onLogout={() => (window.location.href = "/logout")}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
          />
          <main className="flex-1 p-4 sm:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
