"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Failed to load Supabase session:", error.message);
        setLoading(false);
        return;
      }

      const id = data?.session?.user?.id;
      if (!id) {
        console.warn("⚠️ Supabase session exists, but no user ID.");
      }

      setUserId(id ?? null);
      setLoading(false);
    };

    loadSession();
  }, []);

  const handleConnectDropbox = () => {
    if (!userId) {
      alert("User session not found. Please log in again.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!);
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${userId}`;

    console.log("📦 Dropbox OAuth URL:", authUrl);

    window.location.href = authUrl;
  };

  if (loading) return null;

  return (
    <Button onClick={handleConnectDropbox} disabled={!userId}>
      Connect Dropbox
    </Button>
  );
}
