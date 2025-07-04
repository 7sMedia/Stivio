// /app/ai-tool/components/ImageUpload.tsx
"use client";
import React from "react";
import DropboxImportButton from "./DropboxImportButton";

type UploadedImage = {
  name: string;
  url: string;
  fromDropbox?: boolean;
  fileObj?: File; // for local uploads
};

type Props = {
  // Passes the uploaded local file up (for single-upload mode)
  onChange?: (file: File | null) => void;
  // Passes Dropbox files up
  onDropbox?: (files: any[]) => void;
};

export default function ImageUpload({ onChange, onDropbox }: Props) {
  // Handle local file uploads
  function handleLocalUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (onChange) onChange(file);
  }

  // Handle Dropbox file selection
  function handleDropboxFiles(files: any[]) {
    if (onDropbox) onDropbox(files);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Local Upload */}
      <label className="w-full flex flex-col items-center px-4 py-8 bg-indigo-800/60 border-2 border-dashed border-indigo-400/70 rounded-xl cursor-pointer hover:bg-indigo-800/80 transition">
        <span className="text-indigo-200 mb-2">Upload an image (JPG/PNG)</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleLocalUpload}
          className="hidden"
        />
      </label>

      {/* Dropbox Import */}
      <DropboxImportButton onFilesSelected={handleDropboxFiles} />
    </div>
  );
}
