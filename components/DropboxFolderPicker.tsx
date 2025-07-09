"use client";

import React from "react";

interface DropboxFolderPickerProps {
  accessToken: string;
  userId: string;
}

export default function DropboxFolderPicker({ accessToken, userId }: DropboxFolderPickerProps) {
  return (
    <div className="border border-dashed border-gray-400 p-4 text-white">
      <p className="text-sm mb-2">Dropbox Folder Picker</p>
      <p className="text-xs">User ID: {userId}</p>
      <p className="text-xs">Token: {accessToken ? "✔️" : "❌"}</p>
    </div>
  );
}
