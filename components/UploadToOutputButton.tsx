"use client";

import { useState } from "react";
import { uploadToDropbox } from "@/lib/uploadToDropbox";
import { useToast } from "@/components/ui/use-toast";

export default function UploadToOutputButton({
  videoFile,
  outputPath,
}: {
  videoFile: File;
  outputPath: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  async function handleUpload() {
    setIsUploading(true);
    try {
      const result = await uploadToDropbox({ file: videoFile, folderPath: outputPath });
      toast({
        title: "Video uploaded",
        description: `Uploaded to ${result.dropboxPath}`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleUpload}
      disabled={isUploading}
      type="button"
    >
      {isUploading ? "Uploading..." : "Upload to Output Folder"}
    </button>
  );
}
