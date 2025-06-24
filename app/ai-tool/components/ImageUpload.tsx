// /app/ai-tool/components/ImageUpload.tsx
"use client";
import React from "react";

type Props = {
  onChange: (file: File | null) => void;
};

export default function ImageUpload({ onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <label className="w-full flex flex-col items-center px-4 py-8 bg-indigo-800/60 border-2 border-dashed border-indigo-400/70 rounded-xl cursor-pointer hover:bg-indigo-800/80 transition">
        <span className="text-indigo-200 mb-2">Upload an image (JPG/PNG)</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>
    </div>
  );
}
