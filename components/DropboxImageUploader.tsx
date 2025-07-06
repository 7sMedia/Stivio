// /components/DropboxImageUploader.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";

type DropboxImageUploaderProps = {
  userId: string;
};

export default function DropboxImageUploader({ userId }: DropboxImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validExtensions = [".jpg", ".jpeg", ".png"];
      const newFiles = acceptedFiles.filter(file => {
        const ext = file.name.toLowerCase().split(".").pop();
        return ext && validExtensions.includes(`.${ext}`);
      });

      // Prevent duplicates
      const existingNames = new Set(files.map(f => f.name));
      const uniqueFiles = newFiles.filter(f => !existingNames.has(f.name));
      setFiles(prev => [...prev, ...uniqueFiles]);
    },
    [files]
  );

  const handleRename = (index: number, newName: string) => {
    setFiles(prev => {
      const updated = [...prev];
      const ext = updated[index].name.split(".").pop();
      const renamed = new File([updated[index]], `${newName}.${ext}`, { type: updated[index].type });
      updated[index] = renamed;
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    }
  });

  return (
    <div className="border border-[#2a2b35] rounded-lg bg-[#1c1d26] p-4 mt-6">
      <div
        {...getRootProps()}
        className={`cursor-pointer p-6 rounded-md border-2 border-dashed transition ${
          isDragActive ? "border-blue-400 bg-[#27283a]" : "border-[#3a3b4d] bg-[#1f202a]"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-[#a3a4b5] text-sm text-center">
          {isDragActive ? "Drop images here..." : "Drag & drop images or click to upload"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-[#27283a] rounded-md p-2 shadow border border-[#353644]"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={160}
                height={90}
                className="rounded-md object-cover aspect-video"
              />
              <div className="text-xs mt-2 text-white truncate">{file.name}</div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <Button
                  size="icon"
                  className="w-6 h-6 p-0 bg-red-600 hover:bg-red-700"
                  onClick={() => handleDelete(index)}
                >
                  <Trash size={14} />
                </Button>
                <Button
                  size="icon"
                  className="w-6 h-6 p-0 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => {
                    const newName = prompt("Enter new name (no extension):");
                    if (newName) handleRename(index, newName);
                  }}
                >
                  <Pencil size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
