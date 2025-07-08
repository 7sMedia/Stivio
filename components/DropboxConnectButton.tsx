"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DropboxConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data?.session?.user?.id;
      if (uid) {
        console.log("✅ Supabase user ID:", uid);
        setUserId(uid);
      }
    };
    fetchUser();
  }, []);

  const handleConnect = () => {
    if (!userId) {
      alert("User not authenticated.");
      return;
    }
    const redirectUrl = `/api/dropbox/auth?user_id=${encodeURIComponent(userId)}`;
    console.log("🌐 Redirecting to:", redirectUrl);
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
