"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/VideoCard";

interface VideoEntry {
  id: string;
  prompt: string;
  filename: string;
  dropbox_path: string;
  video_url: string;
  created_at: string;
}

export default function HistoryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      try {
        const res = await fetch(`/api/history?userId=${user.id}`);
        const json = await res.json();
        if (res.ok) {
          setVideos(json.data || []);
        } else {
          console.error("Failed to load history:", json.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">Your Generated Videos</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-lg" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-white">No videos found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video_url={video.video_url}
              filename={video.filename}
              prompt={video.prompt}
              created_at={video.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
