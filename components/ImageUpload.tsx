"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/uploadToDropbox";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  inputFolderPath: string;
  onChange?: (file: File | null) => void;
  onDropbox?: (files: any[]) => void;
}

export default function ImageUpload({
  inputFolderPath,
  onChange,
  onDropbox,
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedNames, setUploadedNames] = useState<Set<string>>(new Set());

  const normalize = (name: string) => name.trim().toLowerCase();

  const handleUpload = async (file: File) => {
    const normalized = normalize(file.name);
    if (uploadedNames.has(normalized)) {
      toast({
        title: "Duplicate image",
        description: `You've already uploaded ${file.name}.`,
        variant: "error", // ✅ FIXED: "destructive" → "error"
      });
      return;
    }

    try {
      const dropboxMeta = await uploadToDropbox({ file, folderPath: inputFolderPath });
      onDropbox?.([dropboxMeta]);
      onChange?.(file);
      setUploadedNames(prev => new Set(prev).add(normalized));
    } catch (error: any) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "error", // ✅ FIXED
      });
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setUploading(true);
      for (const file of acceptedFiles) {
        await handleUpload(file);
      }
      setUploading(false);
    },
    [uploadedNames, inputFolderPath]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await handleUpload(file);
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-zinc-600 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors"
    >
      <input {...getInputProps()} />
      <input
        type="file"
        ref={inputRef}
        accept=".jpg,.jpeg,.png"
        hidden
        onChange={handleFileSelect}
      />

      {uploading ? (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-sm">Drop the image here ...</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Drag & drop an image, or click to browse
        </p>
      )}
    </div>
  );
}
