// components/DropboxFolderPicker.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  folderPath: string;
  onChange: (folder: string) => void;
}

export default function DropboxFolderPicker({ folderPath, onChange }: Props) {
  const handlePickFolder = async () => {
    const folder = prompt("Enter Dropbox folder path:", folderPath);
    if (folder) {
      onChange(folder);
    }
  };

  return (
    <div className="w-full flex justify-between items-center gap-2">
      <span className="text-sm truncate">{folderPath}</span>
      <Button onClick={handlePickFolder} className="bg-blue-500 hover:bg-blue-600 text-white">
        Change Folder
      </Button>
    </div>
  );
}
