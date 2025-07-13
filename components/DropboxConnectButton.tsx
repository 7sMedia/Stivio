"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };

    getUserId();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      console.error("❌ Missing user ID");
      return;
    }

    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&state=${userId}`;

    window.location.href = dropboxAuthUrl;
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={!userId}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Connect Dropbox
    </Button>
  );
}
