"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DropboxFolderPickerProps {
  userId: string;
}

export default function DropboxFolderPicker({ userId }: DropboxFolderPickerProps) {
  const [folderPath, setFolderPath] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/automation-config/folder?userId=${userId}`);
      const json = await res.json();
      if (res.ok && json.folderPath) {
        setFolderPath(json.folderPath);
      }
    };

    if (userId) {
      load();
    }
  }, [userId]);

  const handleSave = async () => {
    if (!folderPath.trim()) return;

    setStatus("saving");

    try {
      const res = await fetch("/api/automation-config/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, folderPath }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        throw new Error("Failed to save folder path");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground block">Dropbox Folder Path</label>
      <Input
        value={folderPath}
        onChange={(e) => setFolderPath(e.target.value)}
        placeholder="/Apps/Beta7/generated"
      />
      <Button onClick={handleSave} disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save Folder Path"}
      </Button>
      {status === "success" && <p className="text-green-400 text-sm">✅ Folder saved</p>}
      {status === "error" && <p className="text-red-500 text-sm">❌ Error saving folder</p>}
    </div>
  );
}
