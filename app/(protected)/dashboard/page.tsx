"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { DropboxConnectButton } from "@/components/DropboxConnectButton";
import { DropboxFolderPicker } from "@/components/DropboxFolderPicker";
import { DropboxImageUploader } from "@/components/DropboxImageUploader";
import { PromptTemplatePicker } from "@/components/PromptTemplatePicker";
import { PromptInput } from "@/components/PromptInput";
import { VideoGallery } from "@/components/VideoGallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading || !userId) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card className="p-4 bg-[#1a1a1a] border border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Welcome to Beta7</h2>
          <DropboxConnectButton userId={userId} />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DropboxFolderPicker userId={userId} />
          <DropboxImageUploader userId={userId} />
          <PromptTemplatePicker onSelect={setPrompt} />
          <PromptInput value={prompt} onChange={setPrompt} />
        </div>
        <div>
          <VideoGallery userId={userId} />
        </div>
      </div>
    </div>
  );
}
