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
    const getUserAndToken = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.warn("No Dropbox token found.");
        setToken(null);
      } else {
        setToken(data.access_token);
      }

      setLoading(false);
    };

    getUserAndToken();
  }, [router]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {!token ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="mb-4">Connect your Dropbox account to continue.</p>
            <Button
              onClick={() => {
                window.location.href = `/api/dropbox/auth`;
              }}
            >
              Connect Dropbox
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ Step 3: Render DropboxImageUploader */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
              <DropboxImageUploader accessToken={token} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
