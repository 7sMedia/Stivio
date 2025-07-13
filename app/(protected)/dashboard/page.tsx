"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import PromptInput from "@/components/PromptInput";
import VideoGallery from "@/components/VideoGallery";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      setUserId(data.user.id);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading || !userId) {
    return <p className="text-white p-4">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Welcome to Beta7</h2>
          <DropboxConnectButton userId={userId} />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DropboxFolderPicker userId={userId} />
          <DropboxImageUploader userId={userId} />
          <PromptTemplatePicker />
          <PromptInput />
        </div>
        <VideoGallery userId={userId} />
      </div>
    </div>
  );
}
