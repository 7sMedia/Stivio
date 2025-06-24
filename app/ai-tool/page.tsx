// /app/ai-tool/page.tsx
"use client";
import React, { useState } from "react";
import { generateSeedanceVideo } from "./actions/seedance";
import ImageUpload from "./components/ImageUpload";
import PromptInput from "./components/PromptInput";
import VideoResult from "./components/VideoResult";

export default function AiToolPage() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoLength, setVideoLength] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);

    if (!image || !prompt) {
      setError("Image and prompt are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", image);
    formData.append("video_length", videoLength.toString());

    const res = await generateSeedanceVideo(formData);
    if (res.status === "success" && res.video_url) {
      setVideoUrl(res.video_url);
    } else {
      setError(res.error || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-2 py-8 space-y-5">
      <div className="text-2xl font-bold mb-2 text-center">AI Photo Animator</div>
      {/* Tabs here if you want to add more engines later */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUpload onChange={setImage} />
        <PromptInput value={prompt} onChange={setPrompt} />
        <div>
          <label className="mr-2">Video Length (1-8s):</label>
          <input
            type="number"
            min={1}
            max={8}
            value={videoLength}
            onChange={(e) => setVideoLength(Number(e.target.value))}
            className="input input-bordered w-24"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>
        {error && (
          <div className="text-red-500 font-semibold text-center">{error}</div>
        )}
      </form>
      {videoUrl && <VideoResult url={videoUrl} />}
    </div>
  );
}
