"use client";
import React, { useEffect, useState } from "react";

type DropboxFileListProps = {
  userId: string;
  onProcessFile: (file: any) => void;
};

export default function DropboxFileList({
  userId,
  onProcessFile,
}: DropboxFileListProps) {
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

  if (loading)
    return <div className="text-gray-600">Loading Dropbox files...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!files.length)
    return <div className="text-gray-600">No Dropbox files found.</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {files
        .filter((file) => file[".tag"] === "file")
        .map((file) => (
          <div
            key={file.id}
            className="bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center p-4 w-48"
          >
            <div className="mb-3 w-full flex items-center justify-center h-6">
              <span className="text-gray-900 font-medium text-center truncate">
                {file.name}
              </span>
            </div>
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
              onClick={() => onProcessFile(file)}
            >
              Import / Process
            </button>
          </div>
        ))}
    </div>
  );
}
