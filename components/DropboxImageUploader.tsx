// components/DropboxImageUploader.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  value: string;
  onChange: (file: File) => void;
}

export default function DropboxImageUploader({ userId, value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div
      className={`border-dashed border-2 rounded-lg p-4 text-center ${dragging ? "bg-gray-800" : "bg-gray-900"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="dropbox-image-input"
      />
      <label htmlFor="dropbox-image-input">
        <Button variant="secondary" className="cursor-pointer">Upload Image</Button>
      </label>
      <p className="mt-2 text-sm text-gray-400">or drag & drop an image here</p>
    </div>
  );
}
