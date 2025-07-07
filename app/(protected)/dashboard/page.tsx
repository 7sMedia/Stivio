// app/(protected)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [outputFolder, setOutputFolder] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email ?? null;
      if (!email) {
        window.location.href = "/login";
      } else {
        setUserEmail(email);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Dropbox Folder Picker */}
          <Card className="rounded-lg">
            <h3 className="text-xl font-semibold tracking-tight mb-4 text-text-primary">
              Dropbox Folder Setup
            </h3>
            <div className="space-y-4">
              <label className="text-sm text-text-secondary">Input Folder</label>
              <Button variant="outline" className="w-full">
                {inputFolder ?? "Select Input Folder"}
              </Button>
            </div>
            <div className="space-y-4">
              <label className="text-sm text-text-secondary">Output Folder</label>
              <Button variant="outline" className="w-full">
                {outputFolder ?? "Select Output Folder"}
              </Button>
            </div>
          </Card>

          {/* Upload Images */}
          <Card className="rounded-lg">
            <h3 className="text-xl font-semibold tracking-tight mb-4 text-text-primary">
              Upload Images
            </h3>
            <label
              htmlFor="upload"
              className="flex flex-col items-center justify-center gap-2 border-2 border-text-secondary hover:border-accent transition-all p-6 rounded-lg cursor-pointer text-center"
            >
              <Upload className="w-6 h-6 text-accent" />
              <p className="text-sm text-text-secondary">
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
                    className="relative group border border-surface-secondary rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-32"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Button variant="destructive" size="sm">
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
    </div>
  );
}
