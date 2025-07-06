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

export default function ImageUpload({ inputFolderPath, onChange, onDropbox }: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setUploading(true);

      try {
        for (const file of acceptedFiles) {
          const result = await uploadToDropbox({ file, folderPath: inputFolderPath });
          onDropbox?.([result]);
        }
      } catch (error: any) {
        console.error(error);
        toast({ title: "Upload failed", description: error.message, variant: "error" });
      } finally {
        setUploading(false);
      }
    },
    [inputFolderPath, onDropbox, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToDropbox({ file, folderPath: inputFolderPath });
      onDropbox?.([result]);
      onChange?.(file);
    } catch (error: any) {
      console.error(error);
      toast({ title: "Upload failed", description: error.message, variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-zinc-600 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors"
         {...getRootProps()}>
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
        <p className="text-sm text-muted-foreground">Drag & drop an image, or click to browse</p>
      )}
    </div>
  );
}
