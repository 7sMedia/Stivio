"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DropboxImageUploaderProps {
  userId: string;
}

export default function DropboxImageUploader({ userId }: DropboxImageUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async () => {
    if (!imageUrl || !userId) return;

    setUploadStatus("uploading");

    try {
      const res = await fetch("/api/dropbox/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageUrl }),
      });

      if (res.ok) {
        setUploadStatus("success");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground block">Image URL to Upload</label>
      <Input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      <Button onClick={handleUpload} disabled={uploadStatus === "uploading"}>
        {uploadStatus === "uploading" ? "Uploading..." : "Upload to Dropbox"}
      </Button>
      {uploadStatus === "success" && <p className="text-green-400 text-sm">✅ Uploaded</p>}
      {uploadStatus === "error" && <p className="text-red-500 text-sm">❌ Upload failed</p>}
    </div>
  );
}
