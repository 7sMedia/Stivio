"use client";

import { useRef } from "react";

export interface UploadedImage {
  path: string;
  name: string;
  thumbnail: string;
}

export interface ImageUploadProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: (images: UploadedImage[]) => void;
  selectedImageIdx: number | null;
  setSelectedImageIdx: (idx: number | null) => void;
}

export default function ImageUpload({
  uploadedImages,
  setUploadedImages,
  selectedImageIdx,
  setSelectedImageIdx,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="border border-zinc-800 p-4 rounded bg-zinc-950">
      <p className="text-sm text-zinc-400 mb-2">Uploaded Images</p>
      <div className="flex gap-2 overflow-x-auto">
        {uploadedImages.map((img, idx) => (
          <img
            key={idx}
            src={img.thumbnail}
            alt={img.name}
            className={`w-20 h-20 object-cover rounded cursor-pointer border ${
              selectedImageIdx === idx
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => setSelectedImageIdx(idx)}
          />
        ))}
        <button
          className="w-20 h-20 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          onClick={handleClick}
        >
          +
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={() => {
            // File handling logic would go here
          }}
        />
      </div>
    </div>
  );
}
