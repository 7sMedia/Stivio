"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  token: string;
  folderPath: string;
}

export default function DropboxImageUploader({ token, folderPath }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();

      const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Dropbox-API-Arg": JSON.stringify({
            path: `${folderPath}/${file.name}`,
            mode: "add",
            autorename: true,
            mute: false
          }),
          "Content-Type": "application/octet-stream"
        },
        body: arrayBuffer
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(`Failed to upload ${file.name}:`, error);
      }
    });

    await Promise.all(uploadPromises);
    alert("Upload complete.");
    setUploading(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <label className="text-lg font-semibold text-white">
        Upload images to: <code>{folderPath}</code>
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="block text-white"
      />
      <Button disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Images"}
      </Button>
    </div>
  );
}
