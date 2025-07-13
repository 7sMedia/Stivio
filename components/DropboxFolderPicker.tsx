"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  userId: string;
  value: string;
  onChange: (value: string) => void;
}

const folders = [
  { id: "images/input", name: "Input Folder" },
  { id: "images/secondary", name: "Secondary Folder" },
];

export default function DropboxFolderPicker({ userId, value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Select Dropbox Folder</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a folder" />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder) => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
