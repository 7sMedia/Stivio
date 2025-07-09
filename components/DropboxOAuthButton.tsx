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
    window.location.href = "/api/dropbox/oauth";
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
