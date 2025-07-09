"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
}

export default function DropboxConnectButton({ userId }: Props) {
  const router = useRouter();

  const handleConnect = async () => {
    if (!userId) return;
    const response = await fetch(`/api/dropbox/oauth/start?user_id=${userId}`);
    const { authUrl } = await response.json();

    window.location.href = authUrl; // Full redirect
  };

  return (
    <Button onClick={handleConnect} className="bg-cyan-400 hover:bg-cyan-500 text-black w-full">
      Connect Dropbox
    </Button>
  );
}
