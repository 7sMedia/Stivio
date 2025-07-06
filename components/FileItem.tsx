"use client";

import { useState } from "react";
import { Trash2, Pencil, Check } from "lucide-react";
import { renameDropboxFile } from "@/lib/renameDropboxFile";
import { useToast } from "@/components/ui/use-toast";

interface FileItemProps {
  file: {
    id: string;
    name: string;
    path: string;
    thumbnail: string;
  };
  accessToken: string;
  onRename: (oldPath: string, newPath: string, newName: string) => void;
  onDelete: (path: string) => void;
}

export default function FileItem({
  file,
  accessToken,
  onRename,
  onDelete,
}: FileItemProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = async () => {
    if (!newName || newName === file.name) {
      setEditing(false);
      return;
    }

    const toPath = file.path.replace(file.name, newName);

    try {
      await renameDropboxFile(accessToken, file.path, toPath);
      onRename(file.path, toPath, newName);
      toast({ title: "File renamed", variant: "success" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Rename failed",
        description: err?.error_summary || "An unexpected error occurred",
        variant: "error",
      });
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="border border-zinc-700 rounded-lg p-2 flex items-center gap-4 bg-zinc-900">
      <img
        src={file.thumbnail}
        alt={file.name}
        className="w-16 h-16 object-cover rounded"
      />

      <div className="flex-1">
        {editing ? (
          <input
            className="bg-zinc-800 px-2 py-1 rounded w-full text-white text-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
        ) : (
          <p
            className="text-white text-sm cursor-pointer"
            onClick={() => setEditing(true)}
            title="Click to rename"
          >
            {file.name}
          </p>
        )}
      </div>

      {editing ? (
        <button onClick={handleRename} title="Confirm rename">
          <Check size={18} className="text-green-400" />
        </button>
      ) : (
        <>
          <button onClick={() => setEditing(true)} title="Rename">
            <Pencil size={18} className="text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(file.path)}
            className="ml-2"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-400" />
          </button>
        </>
      )}
    </div>
  );
}
