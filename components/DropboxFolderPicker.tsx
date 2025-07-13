"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchDropboxFolders } from "@/lib/dropboxUtils";

interface Props {
  userId: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DropboxFolderPicker({ userId, value, onChange }: Props) {
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const fetchedFolders = await fetchDropboxFolders(userId);
        setFolders(fetchedFolders);
      } catch (error) {
        console.error("Failed to load Dropbox folders", error);
      }
    };

    if (userId) loadFolders();
  }, [userId]);

  return (
    <div className="space-y-2">
      <Label htmlFor="dropbox-folder" className="text-sm font-medium">
        Select Dropbox Folder
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="dropbox-folder">
          <SelectValue placeholder="Choose a folder..." />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder) => (
            <SelectItem key={folder} value={folder}>
              {folder}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
