// Path: app/(protected)/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    Dropbox: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not found or error occurred:", error);
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email);
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleConnectDropbox = () => {
    if (!userId) {
      alert("User not loaded yet. Please wait...");
      return;
    }

    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!)}&state=${userId}`;

    window.location.href = dropboxAuthUrl;
  };

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm text-gray-400">
          Logged in as: <span className="font-medium">{userEmail}</span>
        </p>
      </Card>

      <Card className="p-4">
        <Button onClick={handleConnectDropbox} className="flex items-center gap-2">
          <UploadCloud size={18} />
          Connect Dropbox
        </Button>
      </Card>
    </div>
  );
}
