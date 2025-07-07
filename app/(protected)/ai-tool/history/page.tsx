"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VideoEntry {
  id: string;
  prompt: string;
  uuid: string;
  filename: string;
  dropbox_path: string;
  created_at: string;
}

export default function HistoryPage() {
  const [videos, setVideos] = useState<VideoEntry[] | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();
      const id = session?.session?.user?.id;
      if (!id) return;

      setUserId(id);

      const { data, error } = await supabase
        .from("generated_videos")
        .select("id, prompt, uuid, filename, dropbox_path, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch videos:", error);
      } else {
        setVideos(data || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">Video History</h1>

      {videos === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No videos generated yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="bg-[#111827]">
              <CardContent className="p-4 space-y-3">
                <video
                  controls
                  src={`https://www.dropbox.com/home${video.dropbox_path}?raw=1`}
                  className="rounded-md w-full max-h-48 object-cover"
                />
                <p className="text-sm text-zinc-400">Prompt:</p>
                <p className="text-white text-sm line-clamp-2">{video.prompt}</p>
                <p className="text-sm text-zinc-500">
                  Created: {new Date(video.created_at).toLocaleString()}
                </p>
                <a
                  href={`https://www.dropbox.com/home${video.dropbox_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="default" className="w-full">
                    Open in Dropbox
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
