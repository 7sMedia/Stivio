"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };

    fetchUser();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("Missing user ID");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

    const url = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${userId}`;

    window.location.href = url;
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
