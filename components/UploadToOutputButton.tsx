"use client";

import { useState } from "react";
import { uploadToDropbox } from "@/lib/uploadToDropbox";
import { toast } from "sonner";

interface UploadToOutputButtonProps {
  videoFile: File;
  folderPath: string;
  onSuccess?: (dropboxMeta: any) => void;
}

export default function UploadToOutputButton({
  videoFile,
  folderPath,
  onSuccess,
}: UploadToOutputButtonProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoFile) return toast.error("No video selected");

    try {
      setUploading(true);
      const dropboxMeta = await uploadToDropbox({
        file: videoFile,
        folderPath,
      });

      toast.success("Video uploaded to output folder");
      onSuccess?.(dropboxMeta);
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <button
      onClick={handleUpload}
      disabled={uploading}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow disabled:opacity-50"
    >
      {uploading ? "Uploading..." : "Upload to Output Folder"}
    </button>
  );
}
