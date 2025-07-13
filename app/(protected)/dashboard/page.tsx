"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, XCircle } from "lucide-react";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxAutomationSetup from "@/components/DropboxAutomationSetup";
import VideoCard from "@/components/VideoCard";

interface VideoEntry {
  id: string;
  prompt: string;
  filename: string;
  video_url: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [recentVideos, setRecentVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");
      setUserId(user.id);

      const { data } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.access_token) {
        setIsConnected(true);
        setAccessToken(data.access_token);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const loadRecent = async () => {
      if (!userId) return;
      const res = await fetch(`/api/history?userId=${userId}`);
      const json = await res.json();
      if (res.ok && json.data) setRecentVideos(json.data.slice(0, 3));
    };
    loadRecent();
  }, [userId]);

  const handleDisconnect = async () => {
    if (!userId) return;
    const res = await fetch("/api/dropbox/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setIsConnected(false);
      setAccessToken(null);
      setSelectedPath(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beta7</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Checking Dropbox status..."
              : isConnected
              ? "✅ Dropbox connected"
              : "❌ Not connected"}
          </p>
        </div>
      </div>

      {/* ✅ AI Tool Card */}
      <Card className="hover:shadow-lg transition">
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">AI Video Tool</h3>
          <p className="text-sm text-muted-foreground">
            Generate social-ready videos with AI prompt templates.
          </p>
          <Button variant="outline" className="mt-2" asChild>
            <a href="/ai-tool">Launch AI Tool</a>
          </Button>
        </CardContent>
      </Card>

      {/* Dropbox Setup */}
      <DropboxAutomationSetup
        accessToken={accessToken}
        isConnected={isConnected}
        userId={userId}
        onDisconnect={handleDisconnect}
        onPathChange={setSelectedPath}
      />

      {/* Folder Picker */}
      {isConnected && (
        <DropboxFolderPicker
          accessToken={accessToken}
          onSelect={setSelectedPath}
          selectedPath={selectedPath}
        />
      )}

      {/* Recent Jobs */}
      {recentVideos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
