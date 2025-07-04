"use client";
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

type UploadedImage = {
  name: string;
  url: string;
  fromDropbox?: boolean;
  fileObj?: File;
};

export default function VideoGenerator() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoLength, setVideoLength] = useState(18);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle image selection
  function handleImageChange(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const imgObj: UploadedImage = {
      name: file.name,
      url,
      fromDropbox: false,
      fileObj: file,
    };
    setUploadedImages(prev => [...prev, imgObj]);
    setSelectedImageIdx(uploadedImages.length); // select new
  }

  // Handle Dropbox or ImageUpload files
  function handleImagesFromUpload(images: UploadedImage[]) {
    setUploadedImages(images);
    setSelectedImageIdx(images.length > 0 ? 0 : null);
  }

  async function handleGenerateVideo() {
    setError(null);
    setVideoUrl(null);
    if (selectedImageIdx === null || !uploadedImages[selectedImageIdx]) {
      setError("Please select an image.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter an animation prompt.");
      return;
    }
    setLoading(true);

    try {
      const imageObj = uploadedImages[selectedImageIdx];

      // If it's a File object, you need to upload as FormData
      let imageData: Blob | string;
      if (imageObj.fromDropbox) {
        // Fetch the Dropbox image as Blob
        const res = await fetch(imageObj.url);
        imageData = await res.blob();
      } else {
        imageData = imageObj.fileObj!;
      }

      // Build FormData for Seedance API
      const formData = new FormData();
      formData.append("image", imageData, imageObj.name);
      formData.append("prompt", prompt);
      formData.append("length", String(videoLength));

      // TODO: Replace URL and add auth if needed
      const apiEndpoint = "https://api.wavespeed.ai/seedance/generate"; // Example endpoint
      const apiRes = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        // headers: { Authorization: "Bearer ..." } // If needed
      });

      if (!apiRes.ok) throw new Error("Video generation failed.");

      // Assume response contains { videoUrl: "..." }
      const { videoUrl } = await apiRes.json();
      setVideoUrl(videoUrl);
    } catch (err: any) {
      setError(err.message || "Error generating video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 mt-8">
      <ImageUpload
        onChange={handleImageChange}
      />
      {/* Image selection */}
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
            </button>
          ))}
        </div>
      )}
      {/* Animation prompt */}
      <input
        className="w-full px-4 py-2 border rounded text-black"
        placeholder="Describe how you want the image to animate..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      {/* Video length */}
      <div className="flex items-center gap-2">
        <label htmlFor="length" className="text-indigo-200">Video Length:</label>
        <select
          id="length"
          className="bg-gray-900 border rounded text-white"
          value={videoLength}
          onChange={e => setVideoLength(Number(e.target.value))}
        >
          <option value={10}>10 seconds</option>
          <option value={18}>18 seconds</option>
          <option value={30}>30 seconds</option>
        </select>
      </div>
      {/* Generate Button */}
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        onClick={handleGenerateVideo}
        disabled={loading}
        type="button"
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>
      {/* Error or Result */}
      {error && <div className="text-red-400">{error}</div>}
      {videoUrl && (
        <video
          controls
          src={videoUrl}
          className="w-full rounded shadow-lg mt-4"
        />
      )}
    </div>
  );
}
