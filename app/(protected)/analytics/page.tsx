// app/(protected)/analytics/page.tsx
"use client";

import React from "react";
import NavBar from "@components/NavBar";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";

export default function AnalyticsPage() {
  // If you need auth-guard or data-fetching, do it here…
  return (
    <div className="min-h-screen flex flex-col bg-[#141518] text-white">
      <NavBar /*…props…*/ />
      <div className="flex flex-1">
        <Sidebar /*…props…*/ />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>
          {/* your analytics dashboard here */}
        </main>
      </div>
    </div>
  );
}
