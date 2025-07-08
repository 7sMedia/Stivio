"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("Not authenticated");
      return;
    }

    const url = `/api/dropbox/auth?user_id=${userId}`;
    window.location.href = url;
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
    >
      Connect Dropbox
    </button>
  );
}
