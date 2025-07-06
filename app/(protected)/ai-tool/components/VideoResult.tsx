// /app/ai-tool/components/VideoResult.tsx
"use client";
import React from "react";

type Props = {
  url: string;
};

export default function VideoResult({ url }: Props) {
  return (
    <div className="mt-6 flex flex-col items-center w-full">
      <video
        src={url}
        controls
        className="rounded-xl shadow-2xl max-w-full w-[350px] md:w-[560px] border-4 border-indigo-600/40 bg-black"
      />
      <a
        href={url}
        download
        className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold shadow-lg hover:from-sky-400 hover:to-fuchsia-500 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Video
      </a>
    </div>
  );
}
