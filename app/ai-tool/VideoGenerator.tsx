"use client";
import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload"; // Keep your path

type UploadedImage = {
  name: string;
  url: string;
  dropboxPath?: string; // NEW: for Dropbox files, store the path
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

  // TODO: Replace this with your real user ID/session
  const userId = typeof window !== "undefined" ? localStorage.getItem("supabase_user_id") || "" : "";

  // -- Image upload/selection handlers --
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
    setSelectedImageIdx(uploadedImages.length); // select new one
  }

  function handleDropboxFiles(files: any[]) {
    const dropboxImages: UploadedImage[] = files.map((file: any) => ({
      name: file.name,
      url: file.link, // a preview link, not the Dropbox API path!
      dropboxPath: file.path_lower || file.path_display, // needed for backend call
      fromDropbox: true,
    }));
    setUploadedImages(prev => [...prev, ...dropboxImages]);
    if (files.length > 0) setSelectedImageIdx(uploadedImages.length); // select first new one
  }

  // -- Video generation handler --
  async function handleGenerateVideo() {
    setError(null);
    setDropboxVideoPath(null);
    setDropboxPreviewUrl(null);

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

      // Only support Dropbox images for this workflow
      if (!imageObj.fromDropbox || !backendDropboxPath) {
        setError("Please select an image from your Dropbox account.");
        setLoading(false);
        return;
      }

      // Backend call
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

      // For previewing directly, you may need to fetch a temporary Dropbox link:
      // (Optional, adjust as needed for your workflow)
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
      }

    } catch (err: any) {
      setError(err.message || "Error generating video.");
    } finally {
      setLoading(false);
    }
  }

  // -- UI --
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 mt-8">
      <ImageUpload
        onChange={handleImageUpload}
        onDropbox={handleDropboxFiles}
      />
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

      {/* Progress/Spinner */}
      {loading && (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Show preview and Dropbox link */}
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
