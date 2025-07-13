"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  onFolderSelect: (path: string) => void;
}

declare global {
  interface Window {
    Dropbox: any;
  }
}

export default function DropboxFolderPicker({ userId, onFolderSelect }: Props) {
  useEffect(() => {
    // Ensure Dropbox Chooser is loaded
    const scriptId = "dropboxjs";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.setAttribute("data-app-key", process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!);
      document.body.appendChild(script);
    }
  }, []);

  const openChooser = () => {
    if (!window.Dropbox) return;

    window.Dropbox.choose({
      success: (files: any[]) => {
        const selectedPath = files[0]?.link || "";
        onFolderSelect(selectedPath);
      },
      cancel: () => {},
      linkType: "preview",
      multiselect: false,
      folderselect: true,
    });
  };

  return (
    <div>
      <Button onClick={openChooser}>Select Dropbox Folder</Button>
    </div>
  );
}
