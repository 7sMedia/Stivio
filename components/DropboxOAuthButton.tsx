"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  userId: string | null;
  accessToken: string | null;
}

export default function DropboxOAuthButton({ userId, accessToken }: Props) {
  const router = useRouter();

  const handleConnect = () => {
    if (!userId) {
      console.error("\ud83d\udc64 Missing user ID");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("\ud83d\udce6 Missing Dropbox clientId or redirectUri");
      return;
    }

    const state = encodeURIComponent(userId);
    const url = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    console.log("\ud83d\udce6 clientId:", clientId);
    console.log("\ud83d\udce6 redirectUri:", redirectUri);
    console.log("\ud83d\udc64 userId:", userId);

    window.location.href = url;
  };

  const handleDisconnect = async () => {
    if (!userId) {
      console.error("\u274c Missing user ID for disconnect");
      return;
    }

    try {
      await fetch("/api/dropbox/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      router.refresh();
    } catch (error) {
      console.error("\u274c Disconnect failed:", error);
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
