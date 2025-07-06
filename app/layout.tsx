import "../styles/globals.css";
import Sidebar from "@components/Sidebar";
import TopBar from "@components/TopBar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  // TODO: Replace with your actual user state logic (context or prop)
  const user = { email: "jay7nyc@hotmail.com" };
  const handleLogout = async () => {
    // You can use your existing logout logic here
    window.location.href = "/logout"; // Or whatever sign-out method you use
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
