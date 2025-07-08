// ✅ File: app/(protected)/connect-dropbox/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConnectDropboxPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const id = session?.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      setUserId(id);
    };

    loadUser();
  }, [router]);

  const handleConnect = () => {
    if (!userId) return;
    window.location.href = `/api/dropbox/auth?user_id=${userId}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full p-8 rounded-lg bg-[#121212] shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Connect your Dropbox</h1>
        <p className="text-center text-gray-400 mb-6">
          Securely sign in to Dropbox to upload media for AI video generation.
        </p>
        <button
          onClick={handleConnect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition"
        >
          Continue with Dropbox
        </button>
      </div>
    </div>
  );
}
