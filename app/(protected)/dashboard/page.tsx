"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Dropbox as DropboxIcon, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  url: string | null;
  error: boolean;
}

declare global {
  interface Window {
    Dropbox: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  // Load Dropbox Chooser SDK
  useEffect(() => {
    const scriptId = "dropbox-chooser";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.dataset.appKey = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
      document.body.appendChild(script);
    }
  }, []);

  // Auth + token fetch
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        const uid = data.session.user.id;
        setUserId(uid);
        const { data: row } = await supabase
          .from("dropbox_tokens")
          .select("access_token")
          .eq("user_id", uid)
          .maybeSingle();
        if (row?.access_token) {
          setToken(row.access_token);
        }
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  // OAuth popup
  const connectDropbox = () => {
    if (!userId) return;
    window.open(
      `/api/dropbox/oauth?state=${encodeURIComponent(userId)}`,
      "dropboxAuth",
      "width=600,height=700"
    );
  };

  // Chooser folder select
  const chooseFolder = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (window.Dropbox) {
      window.Dropbox.choose({
        folderselect: true,
        multiselect: false,
        success: ([folder]: any) => setter(folder.path_display),
      });
    }
  };

  // File upload omitted for brevity...
  // uploadFiles state & uploadToDropbox, handleFiles, removeFile

  const hasImages = uploadFiles.some((u) => u.url);

  // Generate video omitted...

  return (
    <main className="p-6 space-y-8 max-w-[900px] mx-auto">
      {/* 1. Dropbox Connect Card */}
      <Card className="flex flex-col items-center space-y-4 p-8 bg-surface-primary">
        <DropboxIcon size={48} className="text-accent" />
        <h2 className="text-2xl font-semibold text-text-primary">
          {token ? "Dropbox Connected" : "Connect Your Dropbox"}
        </h2>
        <Button
          variant={token ? "secondary" : "primary"}
          className="w-full max-w-xs flex items-center justify-center gap-2"
          onClick={connectDropbox}
        >
          {token ? "Re-connect Dropbox" : "Connect Dropbox"}
        </Button>
        {token && (
          <div className="w-full max-w-xs">
            <label className="block text-sm text-text-secondary mb-1">Input Folder</label>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => chooseFolder(setInputFolder)}
            >
              {inputFolder ?? "Select Input Folder"}
            </Button>
          </div>
        )}
      </Card>

      {/* 2. Upload Panel */}
      {token && inputFolder && (
        <Card className="bg-surface-primary p-6 space-y-4">
          <label
            htmlFor="upload"
            className="
              flex flex-col items-center justify-center
              border-2 border-dashed border-surface-secondary
              rounded-lg p-6 cursor-pointer
              hover:border-accent transition text-text-secondary
            "
          >
            <input
              id="upload"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => /* handleFiles(e.target.files) */ {}}
            />
            <UploadCloud size={32} className="mb-2 text-accent" />
            <span>Drag & drop or click to upload images</span>
          </label>

          {/* Place upload status & thumbnails here */}

          {/* Generate Button */}
          <Button
            variant="secondary"
            className="mt-4"
            disabled={!hasImages}
            onClick={() => {/* handleGenerate() */}}
          >
            Generate Video
          </Button>
        </Card>
      )}
    </main>
  );
}
