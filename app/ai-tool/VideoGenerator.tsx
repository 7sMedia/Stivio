"use client";
import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import { CheckCircle } from "lucide-react";
import PromptTemplatePicker from "./PromptTemplatePicker";

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
  const [loading, setLoading] = useState(false);
  const [dropboxVideoPath, setDropboxVideoPath] = useState<string | null>(null);
  const [dropboxPreviewUrl, setDropboxPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("supabase_user_id") || ""
      : "";

  function handleImageUpload(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const imgObj: UploadedImage = {
      name: file.name,
      url,
      fromDropbox: false,
      fileObj: file,
    };
    setUploadedImages(prev => [...prev, imgObj]);
    setSelectedImageIdx(uploadedImages.length);
  }

  function handleDropboxFiles(files: any[]) {
    const dropboxImages: UploadedImage[] = files.map((file: any) => ({
      name: file.name,
      url: file.link,
      dropboxPath: file.path_lower || file.path_display,
      fromDropbox: true,
    }));
    setUploadedImages(prev => [...prev, ...dropboxImages]);
    if (files.length > 0) setSelectedImageIdx(uploadedImages.length);
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
    if (!prompt.trim()) {
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
          prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video generation failed.");

      setDropboxVideoPath(data.dropbox_video_path);

      // Fetch Dropbox temporary preview link
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
        setShowSuccess(true); // Show checkmark
        setTimeout(() => setShowSuccess(false), 4000); // Show for 4 seconds
      }
    } catch (err: any) {
      setError(err.message || "Error generating video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 mt-8 relative">
      {/* Success Checkmark */}
      {showSuccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
          <CheckCircle size={80} className="text-green-500 mb-4" />
          <div className="text-2xl font-bold text-green-400 mb-2">Video Ready!</div>
        </div>
      )}
      <ImageUpload onChange={handleImageUpload} onDropbox={handleDropboxFiles} />
      {uploadedImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {uploadedImages.map((img, idx) => (
            <button
              key={idx}
              className={`w-20 h-20 rounded overflow-hidden border-2 ${
                idx === selectedImageIdx ? "border-indigo-500" : "border-gray-400"
              }`}
              onClick={() => setSelectedImageIdx(idx)}
              type="button"
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              {img.fromDropbox && (
                <span className="block text-[10px] text-blue-400">Dropbox</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ---- PROMPT TEMPLATE PICKER HERE ---- */}
      <PromptTemplatePicker setPrompt={setPrompt} />

      <input
        className="w-full px-4 py-2 border rounded text-black"
        placeholder="Describe how you want the image to animate..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        onClick={handleGenerateVideo}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <span>
            <span className="inline-block animate-spin mr-2">🔄</span>
            Generating...
          </span>
        ) : (
          "Generate Video"
        )}
      </button>
      {error && <div className="text-red-400">{error}</div>}

      {loading && (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {dropboxVideoPath && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <a
            href={`https://www.dropbox.com/home${dropboxVideoPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
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
