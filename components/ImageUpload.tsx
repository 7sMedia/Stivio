"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface UploadedImage {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  dropboxPath: string;
}

export default function ImageUpload({
  inputFolderPath,
  accessToken,
}: {
  inputFolderPath: string;
  accessToken?: string;
}) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) continue;

      const filename = file.name;
      const isDuplicate = images.some((img) => img.name === filename);

      if (isDuplicate) {
        toast({
          title: "Duplicate file",
          description: `"${filename}" has already been uploaded.`,
          variant: "destructive",
        });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);

      // Optimistically add to UI
      const tempId = `${Date.now()}-${filename}`;
      const dropboxPath = `${inputFolderPath}/${filename}`;

      setImages((prev) => [
        ...prev,
        {
          id: tempId,
          file,
          name: filename,
          previewUrl,
          dropboxPath,
        },
      ]);

      try {
        const uploaded = await uploadToDropbox({
          file,
          path: dropboxPath,
          accessToken,
        });

        toast({
          title: "Uploaded",
          description: `"${uploaded.name}" saved to Dropbox.`,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Upload failed",
          description: `"${filename}" could not be uploaded.`,
          variant: "destructive",
        });

        // Remove from UI on error
        setImages((prev) => prev.filter((img) => img.id !== tempId));
      }
    }
  };

  const handleRename = (id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 rounded-xl text-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-zinc-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">
          Drag & drop images here, or click to upload
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={img.previewUrl}
              alt={img.name}
              width={300}
              height={200}
              className="object-cover w-full h-32"
            />
            <div className="p-2 bg-zinc-900 text-xs">
              <Input
                className="w-full text-white text-xs bg-zinc-800"
                value={img.name}
                onChange={(e) => handleRename(img.id, e.target.value)}
              />
              <Button
                size="sm"
                variant="destructive"
                className="mt-2 w-full"
                onClick={() => handleDelete(img.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
