"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  video_url: string;
  filename: string;
  prompt: string;
  created_at: string;
}

export default function VideoCard({
  video_url,
  filename,
  prompt,
  created_at,
}: VideoCardProps) {
  return (
    <Card className="bg-zinc-900 text-white border border-zinc-700">
      <CardContent className="p-4 space-y-2">
        <video src={video_url} controls className="w-full rounded-md" />
        <div>
          <div className="text-sm text-indigo-400">{filename}</div>
          <div className="text-sm italic text-zinc-300">"{prompt}"</div>
          <div className="text-xs text-zinc-500">
            {new Date(created_at).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
