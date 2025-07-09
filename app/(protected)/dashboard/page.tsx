"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxOAuthButton from "@/components/DropboxOAuthButton";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? null);
      setUserId(user.id);

      const { data: tokenData } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

      if (tokenData?.access_token) {
        setToken(tokenData.access_token);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <p className="p-4 text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-muted p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">Beta7 Dashboard</h1>
          <p className="text-sm text-muted-foreground mb-2">User: {userEmail}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="mt-8 flex items-center justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dropbox Connection</h2>
            <DropboxOAuthButton userId={userId} accessToken={token} />
          </CardContent>
        </Card>

        {/* Placeholder: You can restore Upload, Folder Picker, Prompt Input, Video Gallery here */}
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Other dashboard components go here...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
