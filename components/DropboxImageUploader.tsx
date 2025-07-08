// ✅ File: components/DropboxImageUploader.tsx

"use client";

import React, { useState } from "react";

interface DropboxImageUploaderProps {
  accessToken: string;
}

const DropboxImageUploader: React.FC<DropboxImageUploaderProps> = ({ accessToken }) => {
  const [status, setStatus] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("Uploading...");

    const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: `/beta7_uploads/${file.name}`,
          mode: "add",
          autorename: true,
          mute: false
        }),
        "Content-Type": "application/octet-stream"
      },
      body: file
    });

    if (response.ok) {
      setStatus("Upload successful!");
    } else {
      const errorText = await response.text();
      console.error(errorText);
      setStatus("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default DropboxImageUploader;
