"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoEntry {
  id: string;
  prompt: string;
  uuid: string;
  created_at: string;
}

export default function HistoryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchVideos(user.id);
      }
    };

    const fetchVideos = async (userId: string) => {
      const { data, error } = await supabase
        .from("generated_videos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVideos(data);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Your Video History</h2>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : videos && videos.length > 0 ? (
        videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4">
              <div className="font-semibold">{video.prompt}</div>
              <div className="text-sm text-gray-400">{video.uuid}</div>
              <div className="text-sm">{new Date(video.created_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No videos found.</p>
      )}
    </div>
  );
}
