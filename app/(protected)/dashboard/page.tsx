"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import PromptInput from "@/components/PromptInput";
import VideoGallery from "@/components/VideoGallery";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session?.user) {
        router.push("/login");
      } else {
        setUserId(session.user.id);
        setLoading(false);
      }
    };
    fetchSession();
  }, [router]);

  if (loading || !userId) {
    return <div className="text-center mt-20">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome to Beta7</h1>
          <DropboxConnectButton userId={userId} />
        </div>
      </Card>

      <Card className="p-6">
        <DropboxFolderPicker userId={userId} />
      </Card>

      <Card className="p-6">
        <DropboxImageUploader userId={userId} />
      </Card>

      <Card className="p-6">
        <PromptTemplatePicker />
        <PromptInput />
      </Card>

      <Card className="p-6">
        <VideoGallery userId={userId} />
      </Card>
    </div>
  );
}
