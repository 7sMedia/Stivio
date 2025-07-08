// File: components/DropboxImageUploader.tsx

"use client";

import React, { useCallback, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dropbox } from "dropbox";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";

interface Props {
  accessToken: string;
  selectedFolderPath: string;
}

export default function DropboxImageUploader({ accessToken, selectedFolderPath }: Props) {
  const { session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !accessToken || !selectedFolderPath) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const dbx = new Dropbox({ accessToken });

      for (const file of Array.from(files)) {
        const path = `${selectedFolderPath}/${file.name}`;
        const contents = await file.arrayBuffer();

        await dbx.filesUpload({
          path,
          contents,
          mode: { ".tag": "add" },
          autorename: true
        });
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Failed to upload to Dropbox");
    } finally {
      setUploading(false);
    }
  }, [accessToken, selectedFolderPath]);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="text-white"
      />
      {uploading && <span className="text-yellow-300">Uploading...</span>}
      {error && <span className="text-red-500">{error}</span>}
      {success && <span className="text-green-400">Upload successful!</span>}
    </div>
  );
}
