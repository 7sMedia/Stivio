// components/DropboxFileList.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function DropboxFileList({ userId, onProcessFile }) {
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
