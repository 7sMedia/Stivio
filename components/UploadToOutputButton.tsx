// components/UploadToOutputButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import { useToast } from "@/components/ui/use-toast";

interface UploadToOutputButtonProps {
  videoFile: File;
  outputPath: string;
}

export default function UploadToOutputButton({ videoFile, outputPath }: UploadToOutputButtonProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const result = await uploadToDropbox(videoFile, outputPath);
      toast({
        title: "Video uploaded",
        description: `Uploaded to ${result.path_display}`,
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "Something went wrong while uploading to Dropbox.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button onClick={handleUpload} disabled={isUploading} variant="default">
      {isUploading ? "Uploading..." : "Upload to Output Folder"}
    </Button>
  );
}
