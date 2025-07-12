"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

interface Props {
  onImageSelect: (file: File | null) => void;
}

export default function ManualImageUploader({ onImageSelect }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-white">
        <UploadCloud className="w-4 h-4" />
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-white"
      />

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto rounded border"
          />
        </div>
      )}
    </div>
  );
}
