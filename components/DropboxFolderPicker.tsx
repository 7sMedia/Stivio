"use client";
import React, { useEffect, useState } from "react";

type DropboxFile = {
  id: string;
  name: string;
  path_display: string;
  [key: string]: any;
};

export default function DropboxFolderPicker({
  userId,
  onFolderPick,
  onFilePick,
  initialPath = ""
}: {
  userId: string;
  onFolderPick?: (path: string) => void;
  onFilePick?: (file: DropboxFile) => void;
  initialPath?: string;
}) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/dropbox/list-files?user_id=${userId}&path=${encodeURIComponent(currentPath)}`)
      .then(r => r.json())
      .then(data => {
        if (data.files?.entries) setFiles(data.files.entries);
        else setError(data.error || "Error loading files");
      })
      .catch(() => setError("Failed to fetch Dropbox files"))
      .finally(() => setLoading(false));
  }, [userId, currentPath]);

  const goIntoFolder = (folder: DropboxFile) => {
    setHistory(h => [...h, currentPath]);
    setCurrentPath(folder.path_display);
  };

  const goUp = () => {
    setCurrentPath(history[history.length - 1] || "");
    setHistory(h => h.slice(0, -1));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    const parent = currentPath === "" ? "" : currentPath;
    const fullPath = `${parent}/${newFolderName}`.replace(/\/+/, "/");
    setLoading(true);
    setError(null);
    const res = await fetch("/api/dropbox/create-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, folderPath: fullPath }),
    });
    const data = await res.json();
    if (data.error) setError(data.error + ": " + (data.details || ""));
    else {
      setNewFolderName("");
      // Refresh file list
      setCurrentPath(currentPath => currentPath);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/90 rounded-xl p-6">
      <div className="flex items-center mb-3 gap-2">
        <button
          disabled={history.length === 0}
          onClick={goUp}
          className="px-2 py-1 bg-indigo-700 text-white rounded disabled:opacity-50"
        >Up</button>
        <span className="text-sky-200 text-xs">{currentPath || "/"}</span>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {files.map(f =>
          f[".tag"] === "folder" ? (
            <button
              key={f.id}
              className="p-2 bg-indigo-800/70 rounded flex flex-col items-center text-white hover:bg-sky-700"
              onClick={() => goIntoFolder(f)}
            >
              <span className="text-2xl mb-1">📁</span>
              <span className="text-xs truncate">{f.name}</span>
              <span className="text-[10px] text-blue-400">Folder</span>
              {onFolderPick && (
                <button
                  className="mt-1 px-2 py-0.5 bg-sky-600 text-xs rounded hover:bg-sky-700"
                  onClick={e => { e.stopPropagation(); onFolderPick(f.path_display); }}
                >Pick this folder</button>
              )}
            </button>
          ) : (
            <button
              key={f.id}
              className="p-2 bg-indigo-900/60 rounded flex flex-col items-center text-white hover:bg-sky-700"
              onClick={() => onFilePick && onFilePick(f)}
            >
              <span className="text-2xl mb-1">📄</span>
              <span className="text-xs truncate">{f.name}</span>
              <span className="text-[10px] text-green-400">File</span>
            </button>
          )
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="rounded bg-slate-800 text-white px-2 py-1 text-xs"
          placeholder="New folder name"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-green-600 text-white rounded px-2 py-1 text-xs"
          disabled={loading || !newFolderName}
          onClick={handleCreateFolder}
        >
          + Create Folder
        </button>
      </div>
    </div>
  );
}
