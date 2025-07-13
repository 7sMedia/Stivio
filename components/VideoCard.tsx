"use client";

import React from "react";

export interface VideoCardProps {
  video_url: string;
  filename: string;
  prompt: string;
  created_at: string;
}

export default function VideoCard({ video_url, filename, prompt, created_at }: VideoCardProps) {
  return (
    <div className="border border-zinc-700 rounded-md p-4">
      <video controls className="w-full rounded mb-2">
        <source src={video_url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-sm text-white font-semibold truncate">{filename}</p>
      <p className="text-xs text-muted-foreground mt-1">{prompt}</p>
      <p className="text-xs text-zinc-500 mt-1">{new Date(created_at).toLocaleString()}</p>
    </div>
  );
}
