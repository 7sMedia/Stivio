// /app/ai-tool/components/ImageUpload.tsx
"use client";
import React from "react";

type Props = {
  onChange: (file: File | null) => void;
};

export default function ImageUpload({ onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="file-input file-input-bordered w-full"
      />
    </div>
  );
}
