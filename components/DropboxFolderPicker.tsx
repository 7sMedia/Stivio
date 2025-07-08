"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    Dropbox: any;
  }
}

interface Props {
  accessToken: string;
}

export default function DropboxFolderPicker({ accessToken }: Props) {
  useEffect(() => {
    const scriptId = "dropbox-picker-sdk";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.setAttribute("data-app-key", process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChoose = () => {
    if (!window.Dropbox) {
      alert("Dropbox Picker not loaded.");
      return;
    }

    window.Dropbox.choose({
      linkType: "preview",
      multiselect: false,
      folderselect: true,
      success: (files: any) => {
        if (files && files.length > 0) {
          alert(`Folder selected: ${files[0].link}`);
        }
      },
      cancel: () => {
        console.log("Folder selection cancelled.");
      },
    });
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-3">
      <button
        onClick={handleChoose}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        Choose Dropbox Folder
      </button>
    </div>
  );
}
