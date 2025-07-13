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

interface Props {
  userId: string;
}

export default function VideoGallery({ userId }: Props) {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/history?userId=${userId}`);
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

    loadHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return <p className="text-white">No videos found yet.</p>;
  }

  return (
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
  );
}
