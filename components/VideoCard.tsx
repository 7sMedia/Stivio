"use client";

import { Card } from "@/components/ui/card";

export interface VideoEntry {
  id: string;
  url: string;
  thumbnail_url: string;
  created_at: string;
  prompt: string;
}

interface VideoCardProps {
  video: VideoEntry;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="bg-zinc-800 rounded-lg overflow-hidden shadow-md border border-zinc-700">
      <div className="relative aspect-video w-full">
        <video
          src={video.url}
          controls
          poster={video.thumbnail_url}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 text-sm text-muted-foreground">
        <p className="truncate">🧠 Prompt: {video.prompt}</p>
        <p className="text-xs text-right opacity-70 mt-1">
          {new Date(video.created_at).toLocaleString()}
        </p>
      </div>
    </Card>
  );
}
