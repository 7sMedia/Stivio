"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/uploadToDropbox";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedNames, setUploadedNames] = useState<Set<string>>(new Set());
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Dropbox) {
      console.log("✅ Dropbox SDK loaded.");
      console.log("App Key:", process.env.NEXT_PUBLIC_DROPBOX_APP_KEY);
      setSdkLoaded(true);
    } else {
      console.warn("❌ Dropbox SDK not available.");
    }
  }, []);

  const normalize = (name: string) => name.trim().toLowerCase();

  const handleUpload = async (file: File) => {
    const normalized = normalize(file.name);
    if (uploadedNames.has(normalized)) {
      toast.error(`You’ve already uploaded ${file.name}.`);
      return;
    }

    try {
      const dropboxMeta = await uploadToDropbox({ file, folderPath: inputFolderPath });
      onDropbox?.([dropboxMeta]);
      onChange?.(file);
      setUploadedNames((prev) => new Set(prev).add(normalized));
      toast.success(`${file.name} uploaded to Dropbox`);
    } catch (error: any) {
      console.error("Upload failed", error);
      toast.error(error?.message || "Upload failed.");
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

  const handleDropboxPicker = () => {
    if (!window.Dropbox) {
      toast.error("Dropbox SDK not loaded.");
      return;
    }

    window.Dropbox.choose({
      success: (files: any[]) => {
        console.log("Dropbox files selected:", files);
        onDropbox?.(files);
        toast.success(`${files.length} image(s) selected`);
      },
      cancel: () => {
        console.log("Dropbox picker canceled");
      },
      linkType: "preview",
      multiselect: true,
      extensions: [".jpg", ".jpeg", ".png"],
    });
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
    <div className="flex flex-col gap-4">
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

      <div className="text-center">
        <Button onClick={handleDropboxPicker} disabled={!sdkLoaded}>
          Choose from Dropbox
        </Button>
      </div>
    </div>
  );
}
