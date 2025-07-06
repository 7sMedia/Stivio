"use client";
import React, { useEffect, useState } from "react";

type Video = {
  id: string;
  dropbox_path: string;
  prompt: string;
  created_at: string;
};

export default function UserGeneratedVideos({ userId }: { userId: string }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error fetching videos");
        setVideos(data.videos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchVideos();
  }, [userId]);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
        Your Generated Videos
      </h2>

      {loading && <p className="text-[#b1b2c1]">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && videos.length === 0 && (
        <p className="text-[#b1b2c1]">No videos found yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-[#1e1e28] p-4 rounded-lg border border-[#2c2d36] shadow-inner"
          >
            <p className="text-[#c3bfff] font-semibold text-sm mb-2 break-words">
              {video.prompt}
            </p>
            <a
              href={`https://www.dropbox.com/home${video.dropbox_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm underline break-all"
            >
              View in Dropbox
            </a>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(video.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
