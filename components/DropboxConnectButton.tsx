"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string | null;
}

export default function DropboxConnectButton({ userId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!userId) return;
    setLoading(true);
    const res = await fetch(`/api/dropbox/auth?user_id=${userId}`);
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      alert("Failed to initiate Dropbox OAuth");
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading || !userId}
      className="w-full"
    >
      {loading ? "Loading..." : "Connect Dropbox"}
    </Button>
  );
}
