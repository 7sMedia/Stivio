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
import PromptInput from "@/components/PromptInput";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import VideoCard from "@/components/VideoCard";

interface VideoEntry {
  id: string;
  video_url: string;
  filename: string;
  prompt: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [recentVideos, setRecentVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session?.user?.id) {
        router.push("/login");
        return;
      }
      setUserId(session.user.id);

      const { data, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.access_token) {
        setAccessToken(data.access_token);
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("generated_videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        setRecentVideos(data);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Welcome to Beta7</h2>
          <DropboxConnectButton />
        </div>
      </Card>

      {accessToken && userId && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <DropboxFolderPicker
              userId={userId}
              accessToken={accessToken}
              onSelectPath={(path) => setSelectedPath(path)}
            />
            <div className="flex flex-col gap-4">
              <PromptTemplatePicker onSelectTemplate={setPrompt} />
              <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              <DropboxImageUploader
                accessToken={accessToken}
                userId={userId}
                folderPath={selectedPath ?? ""}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Videos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video_url={video.video_url}
                  filename={video.filename}
                  prompt={video.prompt}
                  created_at={video.created_at}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
