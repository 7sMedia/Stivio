"use client";
import React, { useState, useEffect } from "react";
import { generateSeedanceVideo } from "./actions/seedance";
import ImageUpload from "./components/ImageUpload";
import PromptInput from "./components/PromptInput";
import VideoResult from "./components/VideoResult";
import NavBar from "./components/NavBar"; // FIX: use ./components/NavBar if it's in the same directory
import ProgressBar from "./components/ProgressBar"; // FIX: use ./components/ProgressBar if in same directory
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

const ENGINES = [
  { label: "Seedance", value: "seedance" },
  // { label: "SkyReels", value: "skyreels" },
];

type UploadedImage = {
  name: string;
  url: string;
  fromDropbox?: boolean;
  fileObj?: File;
};

export default function AiToolPage() {
  const [activeEngine, setActiveEngine] = useState("seedance");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoLength, setVideoLength] = useState(5);
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/");
      }
    };
    getUser();
  }, [router]);

  function handleImageUpload(file: File | null) {
    if (!file) return;
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
    const dropboxImages: UploadedImage[] = files.map((file: any) => ({
      name: file.name,
      url: file.link,
      fromDropbox: true,
    }));
    setUploadedImages((prev) => [...prev, ...dropboxImages]);
    if (files.length > 0) setSelectedImageIdx(uploadedImages.length);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    if (selectedImageIdx === null || !uploadedImages[selectedImageIdx] || !prompt) {
      setError("Please select an image and enter a prompt.");
      return;
    }

    setLoading(true);
    let current = 0;
    setProgress(0);
    const fakeProgress = setInterval(() => {
      current += Math.random() * 6 + 4;
      if (current < 92) {
        setProgress(Math.floor(current));
      }
    }, 300);

    const img = uploadedImages[selectedImageIdx];
    let imageData: File | Blob;
    if (img.fromDropbox) {
      const res = await fetch(img.url);
      imageData = await res.blob();
    } else {
      imageData = img.fileObj!;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", imageData, img.name);
    formData.append("video_length", videoLength.toString());

    const res = await generateSeedanceVideo(formData);

    clearInterval(fakeProgress);
    setProgress(100);

    if (res.status === "success" && res.video_url) {
      setVideoUrl(res.video_url);
    } else {
      setError(res.error || "Something went wrong.");
    }
    setLoading(false);

    setTimeout(() => setProgress(0), 900);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <NavBar user={user} />
      <div className="max-w-xl mx-auto px-2 py-8 space-y-6">
        <div className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-sky-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow">
          AI Photo Animator
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {ENGINES.map((engine) => (
            <button
              key={engine.value}
              type="button"
              className={`px-5 py-2 rounded-xl font-semibold transition shadow
                ${
                  activeEngine === engine.value
                    ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white"
                    : "bg-indigo-900 text-indigo-300 hover:bg-indigo-800"
                }
              `}
              onClick={() => setActiveEngine(engine.value)}
            >
              {engine.label}
            </button>
          ))}
        </div>
        {/* Engine Form */}
        {activeEngine === "seedance" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-indigo-950/90 rounded-2xl p-8 shadow-2xl border border-indigo-800/40"
          >
            {/* Upload and Dropbox */}
            <ImageUpload
              onChange={handleImageUpload}
              onDropbox={handleDropboxFiles}
            />
            {/* Show all uploaded images & selection */}
            {uploadedImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {uploadedImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-20 h-20 rounded overflow-hidden border-2 ${
                      idx === selectedImageIdx ? "border-indigo-500" : "border-gray-400"
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      setSelectedImageIdx(idx);
                    }}
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
            <PromptInput value={prompt} onChange={setPrompt} />
            <div>
              <label className="mr-2 text-indigo-200 font-medium">Video Length (1–8s):</label>
              <input
                type="number"
                min={1}
                max={8}
                value={videoLength}
                onChange={(e) => setVideoLength(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg border border-indigo-500 bg-indigo-900 text-indigo-100 placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            {loading && <ProgressBar percent={progress} />}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold shadow-lg hover:from-sky-400 hover:to-fuchsia-500 transition text-lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Video"}
            </button>
            {error && (
              <div className="text-red-400 font-semibold text-center">{error}</div>
            )}
          </form>
        )}
        {videoUrl && <VideoResult url={videoUrl} />}
      </div>
    </>
  );
}
