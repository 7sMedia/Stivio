"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import PromptInput from "@/components/PromptInput";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import VideoGallery from "@/components/VideoGallery";
import { callSeedanceAPI } from "../actions/seedance";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
        return;
      }
      setUserId(data.user.id);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleGenerate = async () => {
    if (!selectedFolder || !prompt) return;
    await callSeedanceAPI({ folderPath: selectedFolder, prompt });
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg">Loading...</p>
      </div>
    );
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
        <DropboxFolderPicker
          userId={userId}
          value={selectedFolder}
          onChange={setSelectedFolder}
        />
      </Card>

      <Card className="p-6">
        <PromptTemplatePicker onSelectTemplate={setPrompt} />
        <PromptInput value={prompt} onChange={setPrompt} />
      </Card>

      <Card className="p-6">
        <Button onClick={handleGenerate} className="w-full bg-green-500 hover:bg-green-600">
          Generate Video
        </Button>
      </Card>

      <Card className="p-6">
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </Card>

      <VideoGallery userId={userId} />
    </div>
  );
}
