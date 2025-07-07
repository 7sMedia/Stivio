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

  const handleUpload = async (file: File) => {
    if (uploadedNames.has(file.name)) {
      toast({
        title: "Duplicate image",
        description: `You've already uploaded ${file.name}.`,
        variant: "destructive",
      });
      return;
    }

    const result = await uploadToDropbox({ file, folderPath: inputFolderPath });
    onDropbox?.([result]);
    setUploadedNames(prev => new Set(prev).add(file.name));
    onChange?.(file);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          await handleUpload(file);
        }
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [inputFolderPath, uploadedNames]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await handleUpload(file);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
  });

  return (
    <div
      className="border-2 border-dashed border-zinc-600 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors"
      {...getRootProps()}
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
