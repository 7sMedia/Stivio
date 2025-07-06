"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function Sidebar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
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
    }, 1000);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 p-6 bg-zinc-950">
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
    </aside>
  );
}
