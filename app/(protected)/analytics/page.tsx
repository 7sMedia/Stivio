// app/(protected)/analytics/page.tsx
"use client";

import React from "react";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";
import NavBar from "@components/NavBar";

export default function AnalyticsPage() {
  // TODO: replace with real user & nav logic
  const user = { email: "jay7nyc@hotmail.com" };

  return (
    <div className="min-h-screen flex bg-[#141518] text-white">
      <Sidebar user={user} open={true} onClose={() => {}} />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} onLogout={() => window.location.href = "/logout"} onMenuToggle={() => {}} />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>
          {/* your analytics dashboard goes here */}
        </main>
      </div>
    </div>
  );
}
