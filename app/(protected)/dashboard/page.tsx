"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import PromptInput from "@/components/PromptInput";
import VideoGallery from "@/components/VideoGallery";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const res = await fetch(`/api/dropbox/token?user_id=${user.id}`);
      const json = await res.json();
      if (res.token) {
        setToken(res.token);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Welcome to Beta7</h1>
        {userId && <DropboxConnectButton userId={userId} />}
      </div>

      {token && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropboxFolderPicker
            userId={userId!}
            value={selectedFolder}
            onChange={setSelectedFolder}
          />
          <DropboxImageUploader userId={userId!} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptTemplatePicker />
        <PromptInput />
      </div>

      {userId && <VideoGallery userId={userId} />}
    </div>
  );
}
