// File: components/DropboxImageUploader.tsx

"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Shadcn UI (optional)
import { Trash, Pencil } from "lucide-react";

interface UploadedImage {
  name: string;
  url: string;
}

interface Props {
  existingImages: UploadedImage[];
  onUpload: (file: File) => void;
  onDelete: (filename: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

export default function DropboxImageUploader({ existingImages, onUpload, onDelete, onRename }: Props) {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!existingImages.some(img => img.name === file.name)) {
        onUpload(file);
      }
    });
  }, [existingImages, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    },
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isDragActive ? 'bg-[#1e1e28]' : 'bg-[#0f0f15]'}`}>
        <input {...getInputProps()} />
        <p className="text-white">Drag & drop images here or click to upload</p>
        <p className="text-sm text-gray-400">Only .jpg, .jpeg, .png files are accepted. Duplicates are ignored.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {existingImages.map(img => (
          <div key={img.name} className="relative rounded overflow-hidden bg-[#1e1e28] p-2">
            <Image src={img.url} alt={img.name} width={200} height={150} className="rounded" />
            <div className="mt-2 text-xs text-white break-all">{img.name}</div>

            <div className="absolute top-1 right-1 flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => onDelete(img.name)}>
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => {
                setRenaming(img.name);
                setNewName(img.name);
              }}>
                <Pencil className="w-4 h-4 text-blue-500" />
              </Button>
            </div>

            {renaming === img.name && (
              <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center gap-2 p-2">
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="text-sm px-2 py-1 rounded w-full"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {
                    onRename(img.name, newName);
                    setRenaming(null);
                  }}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setRenaming(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
