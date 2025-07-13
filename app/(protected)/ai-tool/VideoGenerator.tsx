"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { callSeedanceAPI } from "./actions/seedance";
import PromptTemplatePicker from "./PromptTemplatePicker";
import ImageUpload, { UploadedImage } from "@/components/ImageUpload";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setStatus("Generating video...");

    const selectedImage =
      selectedImageIdx !== null ? uploadedImages[selectedImageIdx] : undefined;

    const res = await callSeedanceAPI({
      prompt,
      image_url: selectedImage?.path,
    });

    if (res.status === "ok" && res.video_url) {
      setVideoUrl(res.video_url);
      setStatus("Video generated!");
    } else {
      setStatus(res.error || "Failed to generate video.");
    }
  };

  const handleTemplatePrompt = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Manual Mode: Generate a Video</h2>

      <PromptTemplatePicker setPrompt={handleTemplatePrompt} />

      {prompt.includes("{text}") && (
        <Input
          placeholder="Enter your custom text to replace {text}"
          className="mt-2"
          onChange={(e) => setPrompt((p) => p.replace("{text}", e.target.value))}
        />
      )}

      <ImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        selectedImageIdx={selectedImageIdx}
        setSelectedImageIdx={setSelectedImageIdx}
      />

      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt for Seedance"
      />

      <Button onClick={handleGenerate}>Generate Video</Button>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded-lg shadow mt-4"
        />
      )}
    </div>
  );
}
