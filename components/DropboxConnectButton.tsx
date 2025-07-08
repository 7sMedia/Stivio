"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DropboxConnectButton() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("❌ Failed to load user:", error);
        return;
      }

      console.log("✅ Loaded Supabase user ID:", user.id);
      setUserId(user.id);
    };

    fetchUserId();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("User not loaded yet. Please wait.");
      return;
    }

    setLoading(true);
    const redirectUrl = `/api/dropbox/auth?user_id=${userId}`;
    console.log("🌐 Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  };

  return (
    <Button onClick={handleConnect} disabled={loading || !userId}>
      {loading ? "Loading..." : "Connect Dropbox"}
    </Button>
  );
}
