// components/sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email ?? null;
      if (!email) {
        window.location.href = "/login";
      } else {
        setUserEmail(email);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
      variant: "success",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full border-r border-zinc-800 p-6 bg-zinc-950 w-64">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Beta7</h1>
      <nav className="space-y-2">
        <Button variant="secondary" className="w-full justify-start">
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          AI Tool
        </Button>
      </nav>
      <div className="mt-auto pt-6 text-sm text-muted-foreground">
        <p className="mb-2">{userEmail ?? "Loading..."}</p>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen">{SidebarContent()}</aside>

      {/* Mobile Topbar + Sidebar Drawer */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950">
        <h1 className="text-xl font-bold">Beta7</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-y-0 left-0 z-50 bg-zinc-950 w-64 border-r border-zinc-800">
          {SidebarContent()}
        </div>
      )}
    </>
  );
}
