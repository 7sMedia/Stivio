"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar";

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

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Dropbox Folder Picker */}
          <Card className="bg-gradient-to-tr from-zinc-900 to-zinc-800 rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Dropbox Folder Setup</h3>

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

          {/* Upload Images */}
          <Card className="bg-gradient-to-tr from-zinc-900 to-zinc-800 rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Upload Images</h3>

              <label
                htmlFor="upload"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-600 hover:border-blue-500 transition-all p-6 rounded-xl cursor-pointer text-center"
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

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((file) => (
                    <div
                      key={file.name}
                      className="relative group border border-zinc-700 rounded-xl overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="object-cover w-full h-32"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(file.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
