"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
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

        {!loading && (isConnected ? (
          <Button variant="destructive" onClick={handleDisconnect}>
            <XCircle className="mr-2 h-4 w-4" />
            Disconnect Dropbox
          </Button>
        ) : (
          userId && (
            <a
              href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&response_type=code&state=${userId}&force_reapprove=true`}
            >
              <Button>
                <UploadCloud className="mr-2 h-4 w-4" />
                Connect Dropbox
              </Button>
            </a>
          )
        ))}
      </div>

      {/* Folder Picker + Automation */}
      {isConnected && accessToken && userId && (
        <div className="space-y-4">
          <DropboxFolderPicker
            userId={userId}
            accessToken={accessToken}
            onSelectPath={setSelectedPath}
          />
          {selectedPath && (
            <DropboxAutomationSetup
              userId={userId}
              accessToken={accessToken}
              folderPath={selectedPath}
            />
          )}
        </div>
      )}

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      )}
    </div>
  );
}
