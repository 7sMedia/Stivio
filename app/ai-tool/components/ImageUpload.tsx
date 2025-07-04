"use client";
import React from "react";
import DropboxImportButton from "./DropboxImportButton";

type Props = {
  onChange?: (file: File | null) => void;
  onDropbox?: (files: any[]) => void;
};

export default function ImageUpload({ onChange, onDropbox }: Props) {
  function handleLocalUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (onChange) onChange(file);
  }

  function handleDropboxFiles(files: any[]) {
    if (onDropbox) onDropbox(files);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <label className="w-full flex flex-col items-center px-4 py-8 bg-indigo-800/60 border-2 border-dashed border-indigo-400/70 rounded-xl cursor-pointer hover:bg-indigo-800/80 transition">
        <span className="text-indigo-200 mb-2">Upload an image (JPG/PNG)</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleLocalUpload}
          className="hidden"
        />
      </label>
      <DropboxImportButton onFilesSelected={handleDropboxFiles} />
    </div>
  );
}
