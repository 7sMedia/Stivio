// components/ImageManager.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Pencil } from "lucide-react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  editing: boolean;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      const isImage = ["jpg", "jpeg", "png"].includes(ext || "");
      const isDuplicate = images.some((img) => img.name === file.name);
      return isImage && !isDuplicate;
    });

    const mapped = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      editing: false,
    }));

    setImages((prev) => [...prev, ...mapped]);
  }, [images]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({ onDrop, multiple: true });

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const toggleEdit = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, editing: !img.editing } : img
      )
    );
  };

  const renameImage = (id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, name: newName, editing: false } : img
      )
    );
  };

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag and drop images here, or click to select (jpg, jpeg, png)</p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative border rounded-lg p-2 bg-zinc-900">
              <Image
                src={img.preview}
                alt={img.name}
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
              {img.editing ? (
                <Input
                  type="text"
                  defaultValue={img.name}
                  onBlur={(e) => renameImage(img.id, e.target.value)}
                  className="mt-2 text-xs"
                />
              ) : (
                <p className="text-xs mt-2 truncate">{img.name}</p>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => toggleEdit(img.id)}>
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => deleteImage(img.id)}>
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
