"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, XCircle } from "lucide-react";
import Sidebar from "@/components/sidebar";
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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [recentVideos, setRecentVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      setUserId(user.id);

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.access_token) {
        setIsConnected(true);
        setAccessToken(data.access_token);
      } else {
        setIsConnected(false);
        setAccessToken(null);
      }

      setLoading(false);
    };

    fetchUserAndStatus();
  }, [router]);

  useEffect(() => {
    const fetchRecentVideos = async () => {
      if (!userId) return;
      const res = await fetch(`/api/history?userId=${userId}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setRecentVideos(json.data.slice(0, 3));
      }
    };

    fetchRecentVideos();
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
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        {/* Welcome + Connect / Disconnect */}
        <Card>
          <CardContent className="py-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Welcome to Beta7</h2>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {isConnected ? "✅ Dropbox Connected" : "❌ Not Connected"}
                </p>
              )}
            </div>
            {!loading && (isConnected ? (
              <Button variant="destructive" onClick={handleDisconnect}>
                <XCircle className="mr-2 h-4 w-4" /> Disconnect Dropbox
              </Button>
            ) : (
              userId && (
                <a
                  href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&response_type=code&state=${userId}&force_reapprove=true`}
                >
                  <Button>
                    <UploadCloud className="mr-2 h-4 w-4" /> Connect Dropbox
                  </Button>
                </a>
              )
            ))}
          </CardContent>
        </Card>

        {/* Folder Picker and Automation Config */}
        {isConnected && userId && accessToken && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Select Input Folder</h3>
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
          <div className="mt-10 space-y-3">
            <h3 className="text-lg font-semibold">Recent Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentVideos.map((v) => (
                <VideoCard
                  key={v.id}
                  video_url={v.video_url}
                  filename={v.filename}
                  prompt={v.prompt}
                  created_at={v.created_at}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
