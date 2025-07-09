"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxOAuthButton from "@/components/DropboxOAuthButton";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (!user) return;

      setUserEmail(user.email ?? null);
      setUserId(user.id);

      const { data: tokenData, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

      if (tokenError) {
        console.error("Error fetching Dropbox token:", tokenError.message);
        return;
      }

      setAccessToken(tokenData?.access_token ?? null);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <aside className="w-64 bg-[#111] min-h-screen p-4 flex flex-col justify-between">
          <div>
            <div className="text-xl font-bold mb-6">Beta7 Dashboard</div>
            <div className="text-sm mb-2">User: {userEmail}</div>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="mt-auto">
            ⎋ Logout
          </Button>
        </aside>
        <main className="flex-1 p-6 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Dropbox Connection</h2>
              <DropboxOAuthButton userId={userId} accessToken={accessToken} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p>Other dashboard components go here...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
