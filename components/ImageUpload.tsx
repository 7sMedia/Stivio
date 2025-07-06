// components/ImageUpload.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import { useToast } from "@/components/ui/use-toast";

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  modifiedName: string;
  dropboxPath?: string;
};

export default function ImageUpload({
  inputFolderPath,
}: {
  inputFolderPath: string;
}) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages: ImageFile[] = [];

      acceptedFiles.forEach((file) => {
        const isDuplicate = images.some(
          (img) => img.file.name === file.name
        );
        if (!isDuplicate && /\.(jpe?g|png)$/i.test(file.name)) {
          const id = `${file.name}-${Date.now()}`;
          const preview = URL.createObjectURL(file);
          newImages.push({
            id,
            file,
            preview,
            modifiedName: file.name,
          });
        } else if (isDuplicate) {
          toast({
            title: "Duplicate skipped",
            description: `${file.name} already exists.`,
            variant: "error",
          });
        }
      });

      // Optimistic UI update
      setImages((prev) => [...prev, ...newImages]);

      // Upload to Dropbox in the background
      newImages.forEach(async (image) => {
        try {
          const dropboxPath = await uploadToDropbox(
            inputFolderPath,
            image.modifiedName,
            image.file
          );
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, dropboxPath } : img
            )
          );
        } catch (err) {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${image.modifiedName}`,
            variant: "error",
          });
        }
      });
    },
    [images, inputFolderPath, toast]
  );

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRename = (id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, modifiedName: newName } : img
      )
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-zinc-600 p-6 text-center rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-zinc-400">Drag & drop images here, or click to select</p>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border border-zinc-700 rounded p-2 bg-zinc-900"
          >
            <Image
              src={img.preview}
              alt={img.modifiedName}
              width={200}
              height={200}
              className="object-cover rounded mb-2"
            />
            <input
              className="w-full text-sm bg-transparent text-white border border-zinc-700 rounded px-2 py-1"
              value={img.modifiedName}
              onChange={(e) => handleRename(img.id, e.target.value)}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(img.id)}
              className="mt-2 w-full"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
