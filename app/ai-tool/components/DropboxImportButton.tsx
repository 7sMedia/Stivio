"use client";
import React from "react";

type DropboxImportButtonProps = {
  onFilesSelected: (files: any[]) => void;
};

const DropboxImportButton: React.FC<DropboxImportButtonProps> = ({ onFilesSelected }) => {
  const handleDropboxImport = () => {
    if (window.Dropbox) {
      window.Dropbox.choose({
        success: (files: any[]) => {
          onFilesSelected(files);
        },
        linkType: "direct",
        multiselect: true,
        extensions: [".jpg", ".jpeg", ".png"],
      });
    } else {
      alert("Dropbox SDK not loaded. Please refresh.");
    }
  };

  return (
    <button
      type="button"
      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleDropboxImport}
    >
      <img src="/dropbox-logo.svg" alt="Dropbox" className="w-5 h-5 mr-2" />
      Import from Dropbox
    </button>
  );
};

export default DropboxImportButton;
