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
    <div className="card mt-4">
      <h2 className="text-xl font-bold mb-4 text-white">Your Generated Videos</h2>

      {loading && <p className="text-[#b1b2c1]">Loading videos...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && videos.length === 0 && (
        <p className="text-[#b1b2c1]">No videos generated yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {videos.map(video => (
          <div key={video.id} className="rounded-lg bg-[#1e1e28] p-3 shadow border border-[#23242d]">
            <p className="text-[#c3bfff] font-semibold">{video.prompt}</p>
            <a
              href={`https://www.dropbox.com/home${video.dropbox_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-sm"
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
