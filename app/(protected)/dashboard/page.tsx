"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [outputFolder, setOutputFolder] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png"].includes(ext ?? "");
      const notDuplicate = !uploadedImages.some(
        (f) => f.name === file.name && f.type === file.type
      );
      return isImage && notDuplicate;
    });
    setUploadedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (filename: string) => {
    setUploadedImages((prev) => prev.filter((f) => f.name !== filename));
  };

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Dropbox Folder Setup */}
        <Card className="bg-surface-primary">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Dropbox Folder Setup
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm text-text-secondary">
                Input Folder
              </label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {/* open Dropbox chooser */}}
              >
                {inputFolder ?? "Select Input Folder"}
              </Button>
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-text-secondary">
                Output Folder
              </label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {/* open Dropbox chooser */}}
              >
                {outputFolder ?? "Select Output Folder"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="bg-surface-primary">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Upload Images
          </h2>
          <label
            htmlFor="upload"
            className="
              flex flex-col items-center justify-center gap-2
              border-2 border-dashed border-surface-secondary
              rounded-lg p-6 cursor-pointer
              hover:border-accent transition
              text-text-secondary
            "
          >
            <Upload className="w-6 h-6 text-accent" />
            <span>Drag &amp; drop or click to upload .jpg, .jpeg, .png</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((file) => (
                <div
                  key={file.name}
                  className="relative group border border-surface-secondary rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-32"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
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
        </Card>
      </div>
    </main>
  );
}
