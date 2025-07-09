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
    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("Missing Dropbox clientId or redirectUri");
      return;
    }

    window.location.href = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  const handleDisconnect = async () => {
    await fetch("/api/dropbox/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    router.refresh();
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
