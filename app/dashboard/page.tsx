"use client";
import React, { useState } from "react";

type PickedFile = {
  link: string;
  name: string;
  id: string;
  thumbnailLink?: string;
  bytes?: number;
  [key: string]: any;
};

declare global {
  interface Window {
    Dropbox: any;
  }
}

function DropboxChooserButton({ onFiles }: { onFiles: (files: PickedFile[]) => void }) {
  function handleChoose() {
    if (!window.Dropbox) {
      alert("Dropbox Chooser not loaded. Please refresh and try again.");
      return;
    }
    window.Dropbox.choose({
      success: (files: PickedFile[]) => onFiles(files),
      cancel: () => {},
      linkType: "preview",
      multiselect: true,
      extensions: [".jpg", ".jpeg", ".png", ".mp4"], // Change as needed!
      // folderselect: true, // Uncomment to allow folders
    });
  }

  return (
    <button
      className="px-5 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
      onClick={handleChoose}
      type="button"
    >
      <span className="inline-block mr-2 align-middle">
        <img src="/dropbox-logo.svg" alt="Dropbox" className="w-5 h-5 inline-block" />
      </span>
      Import from Dropbox
    </button>
  );
}

export default function DashboardPage() {
  const [pickedFiles, setPickedFiles] = useState<PickedFile[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-black px-4 py-10">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Welcome to Your Dashboard</h1>
      <DropboxChooserButton onFiles={setPickedFiles} />

      {pickedFiles.length > 0 && (
        <div className="mt-8 w-full max-w-2xl bg-black/60 rounded-xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-indigo-100 mb-4">
            Files you imported from Dropbox:
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pickedFiles.map((file) => (
              <li
                key={file.id}
                className="bg-indigo-800/60 rounded-xl p-3 flex items-center gap-3"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-black/40 rounded">
                  <img
                    src="/dropbox-logo.svg"
                    alt="Dropbox"
                    className="w-6 h-6"
                  />
                </span>
                <span className="flex-1 truncate text-indigo-100">{file.name}</span>
                <a
                  href={file.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline ml-2"
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 text-indigo-200 text-sm text-center max-w-lg">
        <b>Note:</b> Your Dropbox is <span className="text-green-400 font-semibold">never connected</span> to our app.<br />
        You pick files to import each time. No disconnect button needed!
      </div>
    </div>
  );
}
