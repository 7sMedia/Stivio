"use client";

import React, { useState } from "react";
import ManualImageUploader from "@/components/ManualImageUploader";
import PromptInput from "@/components/PromptInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ManualPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!imageFile || !prompt) {
      setError("Please upload an image and enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("prompt", prompt);

      const res = await fetch("/api/manual-generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate video");

      setVideoUrl(data.video_url);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">Manual Video Generator</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <ManualImageUploader onImageSelect={setImageFile} />
          <PromptInput value={prompt} onChange={setPrompt} />

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || !imageFile || !prompt}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              "Generate Video"
            )}
          </Button>
        </CardContent>
      </Card>

      {videoUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-2">Generated Video:</h2>
          <video
            className="w-full rounded-lg border"
            controls
            src={videoUrl}
          />
        </div>
      )}
    </div>
  );
}
