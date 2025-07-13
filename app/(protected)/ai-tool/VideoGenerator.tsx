"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateVideoFromSeedance } from "./actions/seedance";
import PromptTemplatePicker from "./PromptTemplatePicker";
import ImageUpload, { UploadedImage } from "@/components/ImageUpload"; // ✅ use this

export default function VideoGenerator() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleGenerate = async () => {
    if (selectedImageIdx === null) return;
    const image = uploadedImages[selectedImageIdx];
    const finalPrompt = prompt.replace("{text}", inputText).replace("{image}", image.path);
    setLoading(true);
    const video = await generateVideoFromSeedance(finalPrompt);
    setVideoUrl(video);
    setLoading(false);
  };

  const handleTemplatePrompt = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <div className="space-y-6">
      <ImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        selectedImageIdx={selectedImageIdx}
        setSelectedImageIdx={setSelectedImageIdx}
      />

      <PromptTemplatePicker setPrompt={handleTemplatePrompt} />

      {prompt.includes("{text}") && (
        <Input
          type="text"
          placeholder="Enter custom text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      )}

      <Button onClick={handleGenerate} disabled={loading || selectedImageIdx === null}>
        {loading ? "Generating..." : "Generate Video"}
      </Button>

      {videoUrl && (
        <video className="rounded mt-4" src={videoUrl} controls width="100%" />
      )}
    </div>
  );
}
