"use client";

import { useState } from "react";
import { Trash2, Pencil, Check } from "lucide-react";
import { renameDropboxFile } from "@/lib/renameDropboxFile";
import { toast } from "sonner";

interface FileItemProps {
  file: {
    name: string;
    path: string;
  };
  onDelete: (path: string) => void;
  onRename: (oldPath: string, newPath: string) => void;
}

export default function FileItem({ file, onDelete, onRename }: FileItemProps) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = async () => {
    if (newName === file.name) {
      setRenaming(false);
      return;
    }
    try {
      await renameDropboxFile(file.path, newName);
      onRename(file.path, newName);
      toast.success("File renamed.");
    } catch (error: any) {
      console.error("Rename failed", error);
      toast.error(error.message || "Rename failed.");
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-2">
      {renaming ? (
        <input
          className="bg-transparent text-white border border-zinc-600 rounded px-2 py-1"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      ) : (
        <span className="text-sm text-white">{file.name}</span>
      )}

      <div className="flex gap-2">
        {renaming ? (
          <button onClick={handleRename}>
            <Check className="text-green-400 w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => setRenaming(true)}>
            <Pencil className="text-blue-400 w-4 h-4" />
          </button>
        )}
        <button onClick={() => onDelete(file.path)}>
          <Trash2 className="text-red-400 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
