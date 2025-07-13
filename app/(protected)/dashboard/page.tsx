"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import PromptInput from "@/components/PromptInput";
import VideoGallery from "@/components/UserGeneratedVideos";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getSession();
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome to Beta7</h1>
          <DropboxConnectButton />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptTemplatePicker onSelectTemplate={setPrompt} />
        <PromptInput value={prompt} onChange={setPrompt} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DropboxFolderPicker />
        <DropboxImageUploader />
      </div>

      {userId && <VideoGallery userId={userId} />}
    </div>
  );
}
