"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  const renderNav = () => (
    <nav className="space-y-2">
      <Button variant="secondary" className="w-full justify-start">
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        AI Tool
      </Button>
    </nav>
  );

  const renderFooter = () => (
    <div className="pt-6 text-sm text-muted-foreground">
      <p className="mb-2">{userEmail ?? "Loading..."}</p>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 p-6 bg-zinc-950 min-h-screen">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Beta7</h1>
        {renderNav()}
        <div className="mt-auto">{renderFooter()}</div>
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden p-4 flex items-center justify-between bg-zinc-950 border-b border-zinc-800">
        <h1 className="text-xl font-bold">Beta7</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile sidebar drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed top-14 left-0 w-64 h-full bg-zinc-950 border-r border-zinc-800 p-6 z-50 shadow-lg">
          {renderNav()}
          <div className="mt-6">{renderFooter()}</div>
        </div>
      )}
    </>
  );
}
