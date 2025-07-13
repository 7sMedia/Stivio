// ✅ File: components/DropboxConnectButton.tsx

"use client";

import { Button } from "@/components/ui/button";

export default function DropboxConnectButton() {
  const handleConnect = () => {
    window.location.href = "/api/dropbox/oauth"; // Direct browser redirect
  };

  return (
    <Button
      onClick={handleConnect}
      className="w-full bg-cyan-400 text-black hover:bg-cyan-500"
    >
      Connect Dropbox
    </Button>
  );
}
