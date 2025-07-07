// app/(protected)/ai-tool/VideoGenerator.tsx
"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { CheckCircle } from "lucide-react";
import PromptTemplatePicker from "./PromptTemplatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Restore these definitions
  const inputFolderPath =
    typeof window !== "undefined"
      ? localStorage.getItem("dropbox_input_folder_path") || ""
      : "";
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("supabase_user_id") || ""
      : "";

  function handleTemplatePrompt(templatePrompt: string) {
    setOverlayText("");
    setPrompt(templatePrompt.includes("{text}") ? templatePrompt : templatePrompt);
  }

  const finalPrompt = prompt.includes("{text}")
    ? prompt.replace("{text}", overlayText || "Your text here")
    : prompt;

  function handleImageUpload(file: File | null) {
    if (!file) return;

    const isDuplicate = uploadedImages.some(
      (img) => img.name.toLowerCase() === file.name.toLowerCase()
    );
    if (isDuplicate) {
      setError("This image has already been uploaded.");
      return;
    }

    const url = URL.createObjectURL(file);
    const imgObj: UploadedImage = {
      name: file.name,
      url,
      fromDropbox: false,
      fileObj: file,
    };
    setUploadedImages((prev) => [...prev, imgObj]);
    setSelectedImageIdx(uploadedImages.length);
  }

  function handleDropboxFiles(files: any[]) {
    const uniqueDropboxImages: UploadedImage[] = [];

    for (const file of files) {
      const isDuplicate = uploadedImages.some(
        (img) => img.name.toLowerCase() === file.name.toLowerCase()
      );
      if (!isDuplicate) {
        uniqueDropboxImages.push({
          name: file.name,
          url: file.link,
          dropboxPath: file.path_lower || file.path_display,
          fromDropbox: true,
        });
      }
    }

    if (uniqueDropboxImages.length !== files.length) {
      setError("Some images were skipped because they’re already uploaded.");
    }

    setUploadedImages((prev) => [...prev, ...uniqueDropboxImages]);
    if (uniqueDropboxImages.length > 0) setSelectedImageIdx(uploadedImages.length);
  }

  async function handleGenerateVideo() {
    setError(null);
    setDropboxVideoPath(null);
    setDropboxPreviewUrl(null);
    setShowSuccess(false);

    if (selectedImageIdx === null || !uploadedImages[selectedImageIdx]) {
      setError("Please select an image.");
      return;
    }
    if (!finalPrompt.trim()) {
      setError("Please enter an animation prompt.");
      return;
    }
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);

    try {
      const imageObj = uploadedImages[selectedImageIdx];
      let backendDropboxPath: string | undefined = imageObj.dropboxPath;
      if (!imageObj.fromDropbox || !backendDropboxPath) {
        setError("Please select an image from your Dropbox account.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/ai-tool/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dropboxPath: backendDropboxPath,
          prompt: finalPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video generation failed.");

      setDropboxVideoPath(data.dropbox_video_path);

      const previewRes = await fetch("/api/dropbox/get-temporary-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          path: data.dropbox_video_path,
        }),
      });
      const previewData = await previewRes.json();
      if (previewRes.ok && previewData.link) {
        setDropboxPreviewUrl(previewData.link);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (err: any) {
      setError(err.message || "Error generating video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8 relative px-4">
      {showSuccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
          <CheckCircle size={80} className="text-green-500 mb-4" />
          <div className="text-2xl font-bold text-green-400 mb-2">Video Ready!</div>
        </div>
      )}

      <ImageUpload
        inputFolderPath={inputFolderPath}
        onChange={handleImageUpload}
        onDropbox={handleDropboxFiles}
      />

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImageIdx(idx)}
              className={`relative rounded-xl overflow-hidden border-2 group cursor-pointer transition-all duration-200 ${
                idx === selectedImageIdx ? "border-accent" : "border-surface-secondary"
              }`}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-32 object-cover group-hover:opacity-90 transition"
              />
              {img.fromDropbox && (
                <div className="absolute top-2 left-2 bg-accent text-bg-dark text-xs px-2 py-1 rounded-full">
                  Dropbox
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                }}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      <PromptTemplatePicker setPrompt={handleTemplatePrompt} />

      {prompt.includes("{text}") && (
        <Input
          placeholder="Enter the text to appear in your video"
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          className="w-full"
        />
      )}

      <textarea
        className="w-full bg-surface-primary text-text-primary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        placeholder="Describe how you want the image to animate..."
        value={finalPrompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (!e.target.value.includes("{text}")) setOverlayText("");
        }}
        rows={2}
      />

      <Button
        variant="default"
        size="lg"
        className="w-full justify-center"
        onClick={handleGenerateVideo}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-2">🔄</span> Generating...
          </>
        ) : (
          "Generate Video"
        )}
      </Button>

      {error && <div className="text-destructive">{error}</div>}

      {loading && (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      )}

      {dropboxVideoPath && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <a
            href={`https://www.dropbox.com/home${dropboxVideoPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            View Video in Dropbox
          </a>
          {dropboxPreviewUrl && (
            <video
              controls
              src={dropboxPreviewUrl}
              className="w-full rounded shadow-lg mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
}
