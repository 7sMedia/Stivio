"use client";

import { useEffect, useState } from "react";

interface DropboxFolderPickerProps {
  userId: string;
  accessToken: string;
}

interface DropboxEntry {
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  ".tag": "folder" | "file";
}

export default function DropboxFolderPicker({ userId, accessToken }: DropboxFolderPickerProps) {
  const [folders, setFolders] = useState<DropboxEntry[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFolder(currentPath);
  }, [currentPath]);

  const fetchFolder = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          recursive: false,
          include_non_downloadable_files: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error_summary || "Failed to fetch Dropbox folders.");
      }

      const foldersOnly = data.entries.filter((entry: DropboxEntry) => entry[".tag"] === "folder");
      setFolders(foldersOnly);
    } catch (err: any) {
      setError(err.message || "Error fetching folders.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickFolder = (folder: DropboxEntry) => {
    setPathHistory((prev) => [...prev, currentPath]);
    setCurrentPath(folder.path_lower);
  };

  const handleGoUp = () => {
    const last = pathHistory[pathHistory.length - 1];
    setPathHistory((prev) => prev.slice(0, -1));
    setCurrentPath(last || "");
  };

  const handleSelect = (folder: DropboxEntry) => {
    setSelectedPath(folder.path_display);
    // Optional: Save this to Supabase later
  };

  return (
    <div className="p-4 border border-dashed border-zinc-600 rounded-md">
      <h4 className="text-sm text-muted-foreground mb-2">Dropbox Folder Picker</h4>

      {selectedPath && (
        <div className="mb-4 text-xs text-green-400">
          ✅ Selected Folder: <span className="font-mono">{selectedPath}</span>
        </div>
      )}

      {currentPath && (
        <button
          onClick={handleGoUp}
          className="mb-3 text-xs text-blue-400 hover:underline"
        >
          ⬅️ Go Up
        </button>
      )}

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading folders...</p>
      ) : error ? (
        <p className="text-xs text-red-500">❌ {error}</p>
      ) : folders.length === 0 ? (
        <p className="text-xs text-muted-foreground">No folders found in this directory.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {folders.map((folder) => (
            <li key={folder.id} className="flex justify-between items-center group">
              <button
                onClick={() => handleClickFolder(folder)}
                className="text-left text-white hover:text-sky-400"
              >
                📁 {folder.name}
              </button>
              <button
                onClick={() => handleSelect(folder)}
                className="text-xs text-green-400 hover:underline"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
