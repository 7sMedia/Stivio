"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [outputFolder, setOutputFolder] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const uniqueFiles = files.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png"].includes(ext ?? "");
      const notDuplicate = !uploadedImages.some(
        (f) => f.name === file.name && f.type === file.type
      );
      return isImage && notDuplicate;
    });

    setUploadedImages((prev) => [...prev, ...uniqueFiles]);
  };

  const removeImage = (filename: string) => {
    setUploadedImages((prev) => prev.filter((file) => file.name !== filename));
  };

  const handleRename = (oldName: string, newName: string) => {
    setUploadedImages((prev) =>
      prev.map((file) => {
        if (file.name === oldName) {
          const renamed = new File([file], newName, { type: file.type });
          return renamed;
        }
        return file;
      })
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-4 border-r border-gray-800">
        <h2 className="text-xl font-semibold tracking-tight">Beta7</h2>
        {/* Future: Add nav links */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Dropbox Folder Pickers */}
          <Card className="bg-gradient-to-tr from-zinc-900 to-zinc-800 rounded-2xl shadow-md p-4">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Dropbox Folder Setup</h2>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Input Folder</label>
                <Button variant="outline" className="w-full">
                  {inputFolder ?? "Select Input Folder"}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Output Folder</label>
                <Button variant="outline" className="w-full">
                  {outputFolder ?? "Select Output Folder"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Dropzone */}
          <Card className="bg-gradient-to-tr from-zinc-900 to-zinc-800 rounded-2xl shadow-md p-4">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Images</h2>

              <label
                htmlFor="upload"
                className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-600 hover:border-blue-400 transition-all p-6 rounded-xl cursor-pointer text-center"
              >
                <Upload className="w-6 h-6 text-blue-400" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to upload .jpg, .jpeg, .png
                </p>
              </label>
              <Input
                id="upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* Uploaded Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((file) => (
                  <div
                    key={file.name}
                    className="relative group border border-gray-700 rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-32"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(file.name)}
                      >
                        Delete
                      </Button>
                      {/* Optional: Add Rename Input */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
