"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Props {
  userId: string;
}

interface VideoRecord {
  id: string;
  video_url: string;
  created_at: string;
}

export default function VideoGallery({ userId }: Props) {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("generated_videos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) {
        setVideos(data);
      }

      setLoading(false);
    };

    fetchVideos();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No videos found. Upload an image and generate your first video!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Generated Videos</h2>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-2">
                <video
                  controls
                  src={video.video_url}
                  className="w-full h-auto rounded"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
