"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface UploadedImage {
  id: string;
  name: string;
  path: string;
  previewUrl: string;
  file: File;
}

interface ImageUploadProps {
  dropboxAccessToken: string;
  inputFolderPath: string;
}

export default function ImageUpload({
  dropboxAccessToken,
  inputFolderPath,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["jpg", "jpeg", "png"].includes(ext || "")) {
          toast({ title: "Invalid file", description: file.name });
          continue;
        }

        // Check for duplicate name
        const existing = images.find((img) => img.name === file.name);
        if (existing) {
          toast({
            title: "Duplicate file",
            description: `${file.name} already uploaded.`,
          });
          continue;
        }

        const previewUrl = URL.createObjectURL(file);

        // Optimistic update
        const newImage: UploadedImage = {
          id: crypto.randomUUID(),
          name: file.name,
          path: "",
          file,
          previewUrl,
        };
        setImages((prev) => [...prev, newImage]);

        try {
          const { path } = await uploadToDropbox(
            dropboxAccessToken,
            inputFolderPath,
            file
          );

          // Update path in metadata
          setImages((prev) =>
            prev.map((img) =>
              img.id === newImage.id ? { ...img, path } : img
            )
          );
        } catch (err) {
          toast({
            title: "Upload error",
            description: (err as Error).message,
          });
        }
      }
    },
    [dropboxAccessToken, inputFolderPath, images, toast]
  );

  const handleRename = (id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-zinc-600"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">
          Drag & drop images here, or click to upload
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="flex items-center justify-between border border-zinc-700 rounded-md p-2"
          >
            <div className="flex items-center gap-3">
              <Image
                src={img.previewUrl}
                alt={img.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="space-y-1">
                <Input
                  className="text-sm bg-zinc-800 border-zinc-600 w-48"
                  value={img.name}
                  onChange={(e) => handleRename(img.id, e.target.value)}
                />
                <p className="text-xs text-muted-foreground break-all">
                  {img.path || "Uploading..."}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(img.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
