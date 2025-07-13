// app/(protected)/ai-tool/VideoGenerator.tsx
"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { CheckCircle } from "lucide-react";
import PromptTemplatePicker from "./PromptTemplatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

type UploadedImage = {
  name: string;
  url: string;
  dropboxPath?: string;
  fromDropbox?: boolean;
  fileObj?: File;
};

export default function VideoGenerator() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropboxVideoPath, setDropboxVideoPath] = useState<string | null>(null);
  const [dropboxPreviewUrl, setDropboxPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTemplatePrompt = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  const handleGenerate = async () => {
    if (selectedImageIdx === null) return;
    const image = uploadedImages[selectedImageIdx];
    setLoading(true);
    setError(null);
    setShowSuccess(false);

    try {
      const res = await fetch("/app/(protected)/ai-tool/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "", // to be populated with real user ID
          dropboxPath: image.dropboxPath,
          prompt: prompt.replace("{text}", overlayText),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
      } else {
        setDropboxVideoPath(data.dropbox_video_path);
        setDropboxPreviewUrl(data.seedance_metadata?.video_url);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Generation error", err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Manual Video Generator</h1>

      <ImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        selectedImageIdx={selectedImageIdx}
        setSelectedImageIdx={setSelectedImageIdx}
      />

      <PromptTemplatePicker
        onSelectTemplate={(tpl) => handleTemplatePrompt(tpl.prompt)}
      />

      {prompt.includes("{text}") && (
        <Input
          type="text"
          placeholder="Enter overlay text..."
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
        />
      )}

      <Textarea
        placeholder="Final prompt used for Seedance AI"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Video"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
      {showSuccess && dropboxPreviewUrl && (
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle size={18} />
          <a
            href={dropboxPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Preview your video
          </a>
        </div>
      )}
    </div>
  );
}
