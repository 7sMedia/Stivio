"use client";

import React from "react";

export default function VideoPreview({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <video
        controls
        className="w-full rounded-xl shadow-lg"
        src={videoUrl}
      />
    </div>
  );
}
