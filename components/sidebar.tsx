"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { navItems } from "@/app/src/config/nav";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Sidebar() {
  const router = useRouter();
  const path = usePathname() || "";
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
    toast.success("You have been signed out successfully.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full border-r border-zinc-800 p-6 bg-zinc-950 w-64">
      <h1 className="text-2xl font-bold tracking-tight mb-4 flex items-center justify-between">
        <span>Beta7</span>
        <ThemeToggle />
      </h1>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const active = path === item.href;
          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(item.href)}
            >
              {item.title}
            </Button>
          );
        })}
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
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Beta7</h1>
          <ThemeToggle />
        </div>
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
