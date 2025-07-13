"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Supabase session fetch error:", error.message);
        setLoading(false);
        return;
      }

      const uid = data?.session?.user?.id ?? null;

      if (!uid) {
        console.warn("⚠️ No user ID found in session.");
      }

      setUserId(uid);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      console.warn("❌ No user ID. Supabase session is likely missing.");
      alert("Please sign in before connecting Dropbox.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!);
    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${userId}`;

    console.log("✅ Redirecting to Dropbox:", dropboxAuthUrl);

    window.location.href = dropboxAuthUrl;
  };

  if (loading) return null;

  return (
    <Button onClick={handleConnect} disabled={!userId}>
      Connect Dropbox
    </Button>
  );
}
