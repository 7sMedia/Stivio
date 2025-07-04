// components/DropboxFileList.tsx

"use client";
import React, { useEffect, useState } from "react";

type DropboxFileListProps = {
  userId: string;
  onProcessFile: (file: any) => void;
};

export default function DropboxFileList({ userId, onProcessFile }: DropboxFileListProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/dropbox/list-files?user_id=${userId}`);
      const data = await res.json();
      if (data.files?.entries) {
        setFiles(data.files.entries);
      } else {
        setError(data.error || "Failed to load files.");
      }
      setLoading(false);
    }
    if (userId) fetchFiles();
  }, [userId]);

  if (loading) return <div>Loading Dropbox files...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!files.length) return <div>No Dropbox files found.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {files.map(file =>
        file[".tag"] === "file" ? (
          <div key={file.id} className="p-2 bg-indigo-900/60 rounded shadow flex flex-col items-center">
            {/* Image preview if file is an image (future: use your own API to protect files) */}
            {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <div className="mb-1 w-20 h-20 bg-black rounded flex items-center justify-center">
                <span className="text-xs text-indigo-300">Preview unavailable</span>
                {/* 
                // You cannot directly use Dropbox API URLs for <img src> unless the file is public/shared.
                // In production, create a backend route that securely fetches and streams the file buffer.
                */}
              </div>
            ) : null}
            <span className="text-indigo-200 text-xs truncate mb-1">{file.name}</span>
            <button
              className="mt-1 px-3 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-700"
              onClick={() => onProcessFile(file)}
            >
              Import/Process
            </button>
          </div>
        ) : null
      )}
    </div>
  );
}
