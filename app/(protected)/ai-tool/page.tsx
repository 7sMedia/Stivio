"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload, { UploadedImage } from "@/components/ImageUpload";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AIToolPage() {
  const [prompt, setPrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");

  const handleGenerate = async () => {
    if (!prompt || selectedImageIdx === null) return;
    setStatus("generating");

    const image = uploadedImages[selectedImageIdx];
    // TODO: Send `image` and `prompt` to Seedance API
    console.log("Generating with:", { prompt, image });

    // Simulate delay
    await new Promise((res) => setTimeout(res, 1500));
    setStatus("done");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">AI Video Generator</h1>

      <div className="space-y-4">
        <PromptTemplatePicker setPrompt={setPrompt} />

        <label className="text-sm font-medium text-white block mb-2">Upload Image</label>
        <ImageUpload
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          selectedImageIdx={selectedImageIdx}
          setSelectedImageIdx={setSelectedImageIdx}
        />

        <label className="text-sm font-medium text-white block mt-4">Prompt</label>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full"
          placeholder="Describe your animation..."
        />

        <Button
          onClick={handleGenerate}
          disabled={status === "generating"}
          className="mt-4"
        >
          {status === "generating" ? "Generating..." : "Generate Video"}
        </Button>
      </div>
    </div>
  );
}
