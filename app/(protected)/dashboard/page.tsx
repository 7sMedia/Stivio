// ✅ File: app/(protected)/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import DropboxOAuthButton from "@/components/DropboxOAuthButton";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/login");
        return;
      }

      const user = session.user;
      setUserId(user.id);
      setUserEmail(user.email || null);

      const { data, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (tokenError) {
        console.error("Failed to fetch Dropbox token:", tokenError);
      }

      setAccessToken(data?.access_token || null);
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mb-6 p-4 bg-zinc-800">
          <div className="text-sm">Welcome, {userEmail}</div>
        </Card>

        <div className="mb-6">
          <DropboxOAuthButton userId={userId} accessToken={accessToken} />
        </div>

        {/* Other dashboard components go here */}
        <div className="text-zinc-300">Dashboard content here...</div>
      </main>
    </div>
  );
}
