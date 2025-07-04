// /app/ai-tool/components/ImageUpload.tsx
"use client";
import React, { useState } from "react";
import DropboxImportButton from "./DropboxImportButton";

type Props = {
  onChange?: (file: File | null) => void; // Now optional, to not break current usage
};

type UploadedImage = {
  name: string;
  url: string;
  fromDropbox?: boolean;
  fileObj?: File; // for local uploads
};

export default function ImageUpload({ onChange }: Props) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Handle local file uploads
  function handleLocalUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    const imgObj: UploadedImage = {
      name: file.name,
      url,
      fromDropbox: false,
      fileObj: file,
    };
    setUploadedImages((prev) => [...prev, imgObj]);
    if (onChange) onChange(file);
  }

  // Handle Dropbox file selection
  function handleDropboxFiles(files: any[]) {
    const dropboxImages: UploadedImage[] = files.map((file: any) => ({
      name: file.name,
      url: file.link, // direct link to image
      fromDropbox: true,
    }));
    setUploadedImages((prev) => [...prev, ...dropboxImages]);
    // You can also pass these files to parent if needed:
    // if (onChange) onChange(null);
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

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="flex gap-4 flex-wrap mt-4">
          {uploadedImages.map((img, idx) => (
            <div key={idx} className="w-24 h-24 border rounded overflow-hidden flex flex-col items-center">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <span className="text-xs truncate text-white bg-black bg-opacity-40 px-1">{img.name}</span>
              {img.fromDropbox && (
                <span className="text-[10px] text-blue-400">Dropbox</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
