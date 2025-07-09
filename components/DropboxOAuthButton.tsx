"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  userId: string | null;
  accessToken: string | null;
}

export default function DropboxOAuthButton({ userId, accessToken }: Props) {
  const router = useRouter();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

    console.log("📦 clientId:", clientId);
    console.log("📦 redirectUri:", redirectUri);
    console.log("👤 userId:", userId);
  }, [userId]);

  const handleConnect = () => {
    if (!userId) {
      console.error("❌ Missing user ID");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("❌ Missing Dropbox clientId or redirectUri");
      return;
    }

    const state = encodeURIComponent(userId);
    const authUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    console.log("🌐 Redirecting to:", authUrl);
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (!userId) {
      console.error("❌ Missing user ID for disconnect");
      return;
    }

    try {
      const res = await fetch("/api/dropbox/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Disconnect failed:", text);
      } else {
        console.log("✅ Disconnected from Dropbox");
        router.refresh();
      }
    } catch (err) {
      console.error("❌ Disconnect error:", err);
    }
  };

  if (accessToken) {
    return (
      <Button variant="destructive" onClick={handleDisconnect}>
        Disconnect from Dropbox
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect}>
      Connect Dropbox
    </Button>
  );
}
