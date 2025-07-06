// app/layout.tsx

import "../styles/globals.css";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";
import { ReactNode } from "react";

interface User {
  email: string;
}

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  // Replace with your actual user state logic (context or prop)
  const user: User = { email: "jay7nyc@hotmail.com" };

  const handleLogout = async () => {
    // Replace with your actual logout logic
    window.location.href = "/logout"; // Or your logout API endpoint
  };

  return (
    <html lang="en">
      <body className="bg-[#141518] text-white min-h-screen font-sans antialiased">
        <Sidebar user={user} />
        <div className="ml-60 min-h-screen flex flex-col">
          <TopBar user={user} onLogout={handleLogout} />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
