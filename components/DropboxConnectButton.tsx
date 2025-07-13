"use client";

import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
}

function DropboxConnectButton({ userId }: Props) {
  const handleConnect = async () => {
    if (!userId) return;

    const res = await fetch(`/api/dropbox/oauth/start?user_id=${userId}`);
    const { authUrl } = await res.json();

    window.location.href = authUrl;
  };

  return (
    <Button onClick={handleConnect} className="w-full bg-cyan-400 text-black hover:bg-cyan-500">
      Connect Dropbox
    </Button>
  );
}

export default DropboxConnectButton;
