"use client";
import "../styles/globals.css";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const user = { email: "jay7nyc@hotmail.com" };
  const handleLogout = async () => {
    window.location.href = "/logout";
  };

  return (
    <html lang="en">
      <body className="bg-[#141518] text-white min-h-screen font-sans antialiased">
        <Sidebar user={user} />
        <div className="ml-60 min-h-screen flex flex-col">
          <TopBar user={user} onLogout={handleLogout} />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
