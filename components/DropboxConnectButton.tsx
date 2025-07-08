"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("✅ Supabase user ID:", data?.user?.id);
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }
    const redirectUrl = `/api/dropbox/auth?user_id=${userId}`;
    console.log("➡️ Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
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
