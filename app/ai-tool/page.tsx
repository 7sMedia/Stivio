"use client";
import React, { useState, useEffect } from "react";
import { generateSeedanceVideo } from "./actions/seedance";
import ImageUpload from "./components/ImageUpload";
import PromptInput from "./components/PromptInput";
import VideoResult from "./components/VideoResult";
import NavBar from "components/NavBar";
import ProgressBar from "components/ProgressBar";
import { supabase } from "lib/supabaseClient";
import { useRouter } from "next/navigation";

const ENGINES = [
  { label: "Seedance", value: "seedance" },
  // { label: "SkyReels", value: "skyreels" }, // Example for future
];

export default function AiToolPage() {
  const [activeEngine, setActiveEngine] = useState("seedance");
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoLength, setVideoLength] = useState(5);
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Auth guard: check if user logged in
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/"); // Not logged in
      }
    };
    getUser();
  }, [router]);

  // Simulated Progress Bar Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    if (!image || !prompt) {
      setError("Image and prompt are required.");
      return;
    }

    setLoading(true);

    // Simulate smooth progress bar
    let current = 0;
    setProgress(0);
    const fakeProgress = setInterval(() => {
      current += Math.random() * 6 + 4; // Increment 4–10% per tick
      if (current < 92) {
        setProgress(Math.floor(current));
      }
    }, 300);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", image);
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
    // Optionally show a loading spinner or blank while fetching user
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">Loading...</div>;
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
            <ImageUpload onChange={setImage} />
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
            {/* Progress bar */}
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
        {/* Add other engine forms here */}
        {videoUrl && <VideoResult url={videoUrl} />}
      </div>
    </>
  );
}
