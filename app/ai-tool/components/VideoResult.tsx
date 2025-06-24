// /app/ai-tool/components/VideoResult.tsx
"use client";
import React from "react";

type Props = {
  url: string;
};

export default function VideoResult({ url }: Props) {
  return (
    <div className="mt-6 flex flex-col items-center">
      <video src={url} controls className="rounded-xl shadow max-w-full h-auto" />
      <a
        href={url}
        download
        className="btn btn-primary mt-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Video
      </a>
    </div>
  );
}
