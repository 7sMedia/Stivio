"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { CheckCircle } from "lucide-react";
import PromptTemplatePicker from "./PromptTemplatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  // Assume inputFolderPath, userId, handlers (handleImageUpload, handleDropboxFiles, handleGenerateVideo, etc.) remain unchanged

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
