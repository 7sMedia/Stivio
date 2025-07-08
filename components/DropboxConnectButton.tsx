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
      } else {
        console.warn("❌ No user ID returned by Supabase");
      }
    };
    fetchUser();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("User not authenticated. Please log in.");
      console.warn("❌ userId is null");
      return;
    }

    const redirectUrl = `/api/dropbox/auth?user_id=${userId}`;
    console.log("➡️ Redirecting to:", redirectUrl);

    try {
      window.location.href = redirectUrl;
    } catch (e) {
      console.error("❌ Redirect failed", e);
    }
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
