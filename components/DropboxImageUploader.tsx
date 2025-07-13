"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  userId: string;
}

export default function DropboxImageUploader({ userId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const res = await fetch("/api/dropbox/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      // Optional: reset after success
      setSelectedFile(null);
      alert("Upload successful!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-muted border border-gray-700">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <UploadCloud className="w-5 h-5" />
        Upload Image
      </h2>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload to Dropbox"}
      </Button>
    </Card>
  );
}
