// app/(protected)/calendar/page.tsx
"use client";

import React from "react";
// …same imports…

export default function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141518] text-white">
      {/* NavBar, Sidebar, TopBar as above */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        {/* calendar UI */}
      </main>
    </div>
  );
}

