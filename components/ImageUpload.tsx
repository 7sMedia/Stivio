// components/ImageUpload.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import Image from "next/image";

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  dropboxPath?: string;
  modifiedName: string;
}

export default function ImageUpload({
  accessToken,
  inputFolder,
}: {
  accessToken: string;
  inputFolder: string;
}) {
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        if (!isImage) return;

        const exists = images.find((img) => img.file.name === file.name);
        if (exists) {
          toast({
            title: "Duplicate file",
            description: `${file.name} is already uploaded.`,
            variant: "destructive",
          });
          return;
        }

        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);
        const modifiedName = file.name;

        // Optimistic UI
        setImages((prev) => [...prev, { id, file, previewUrl, modifiedName }]);

        try {
          const res = await uploadToDropbox({
            file,
            accessToken,
            folderPath: inputFolder,
            modifiedFilename: modifiedName,
          });

          setImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, dropboxPath: res.path } : img
            )
          );
        } catch (err) {
          toast({
            title: "Upload failed",
            description: file.name,
            variant: "destructive",
          });
          setImages((prev) => prev.filter((img) => img.id !== id));
        }
      });
    },
    [images, accessToken, inputFolder, toast]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRename = (id: string) => {
    const newName = prompt("Enter new filename:");
    if (!newName) return;
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, modifiedName: newName } : img
      )
    );
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border border-dashed border-zinc-600 p-6 rounded-lg text-center cursor-pointer hover:border-zinc-400 transition"
      >
        <input {...getInputProps()} />
        <p className="text-zinc-400">Drag & drop images here, or click to select</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <Image
                src={img.previewUrl}
                alt={img.modifiedName}
                width={300}
                height={300}
                className="rounded-lg object-cover aspect-square"
              />
              <div className="absolute top-1 right-1 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRename(img.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(img.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-center mt-1 truncate">{img.modifiedName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
