"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DropboxImageUploader from "@/components/DropboxImageUploader";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      const id = session.user.id;
      setUserId(id);

      const { data, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (tokenError || !data?.access_token) {
        console.warn("No Dropbox token found for this user.");
        setToken(null);
      } else {
        setToken(data.access_token);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {!token ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="mb-4">Connect your Dropbox account to continue.</p>
            {/* ✅ Updated Button: Redirects to full-screen connect flow */}
            <Button
              onClick={() => router.push("/connect-dropbox")}
            >
              Connect Dropbox
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
            <DropboxImageUploader accessToken={token} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
