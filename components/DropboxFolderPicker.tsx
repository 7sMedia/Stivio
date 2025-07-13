"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  userId: string;
  accessToken: string;
  value: string;
  onChange: (value: string) => void;
}

interface DropboxEntry {
  id: string;
  name: string;
  path_display: string;
}

export default function DropboxFolderPicker({
  userId,
  accessToken,
  value,
  onChange,
}: Props) {
  const [folders, setFolders] = useState<DropboxEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "/images",
            recursive: false,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true,
            include_non_downloadable_files: false,
          }),
        });

        const data = await res.json();

        if (data.entries) {
          const folderEntries = data.entries.filter((entry: any) => entry[".tag"] === "folder");
          setFolders(folderEntries);
        }
      } catch (err) {
        console.error("Error fetching Dropbox folders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchFolders();
    }
  }, [accessToken]);

  return (
    <div className="space-y-2">
      <Label>Select Dropbox Folder</Label>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading folders...</p>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.path_display}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
