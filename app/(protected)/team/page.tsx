// app/(protected)/team/page.tsx
"use client";

import React from "react";

export default function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141518] text-white">
      {/* NavBar, Sidebar, TopBar will be rendered by the layout */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Team</h1>
        {/* TODO: your team management UI goes here */}
      </main>
    </div>
  );
}
