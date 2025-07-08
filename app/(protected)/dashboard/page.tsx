"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  url: string | null;
  error: boolean;
}

declare global {
  interface Window {
    Dropbox: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [chooserReady, setChooserReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (window.Dropbox) setChooserReady(true);

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id ?? null);
        setUserEmail(user.email ?? null);
        setLoading(false);
      } else {
        console.error("❌ No Supabase user returned");
      }
    });
  }, []);

  const handleConnectDropbox = async () => {
    console.log("✅ Connect Dropbox button clicked");

    if (!userId) {
      alert("User ID not loaded yet");
      console.error("❌ Cannot connect Dropbox: userId is null");
      return;
    }

    try {
      const response = await fetch(`/api/dropbox/auth?user_id=${encodeURIComponent(userId)}`, {
        method: "GET",
      });

      console.log("✅ /api/dropbox/auth response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to get Dropbox auth URL:", errorText);
        return;
      }

      const { url } = await response.json();
      if (!url) {
        console.error("❌ No redirect URL returned from server");
        return;
      }

      console.log("✅ Redirecting to Dropbox:", url);
      window.location.href = url;
    } catch (err) {
      console.error("❌ Error in handleConnectDropbox:", err);
    }
  };

  if (loading) {
    return <p className="text-white text-center p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <p className="mb-2 text-white">
          ✅ Logged in as: <strong>{userEmail || "Unknown"}</strong>
        </p>
        <Button onClick={handleConnectDropbox}>Connect Dropbox</Button>
      </Card>
    </div>
  );
}
