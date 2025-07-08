"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
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
  const [chooserReady, setChooserReady] = useState(false);

  useEffect(() => {
    const APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
    if (!APP_KEY) {
      console.error("Missing NEXT_PUBLIC_DROPBOX_APP_KEY");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.id = "dropboxjs";
    script.setAttribute("data-app-key", APP_KEY);
    script.onload = () => setChooserReady(true);
    script.onerror = () => console.error("Failed to load Dropbox Chooser SDK");

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById("dropboxjs");
      if (el) el.remove();
    };
  }, []);

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

  const connectDropbox = async () => {
    console.log("✅ Connect Dropbox button clicked");

    if (!userId) {
      alert("User ID not loaded yet");
      console.error("❌ Cannot connect Dropbox: userId is null");
      return;
    }

    try {
      const response = await fetch(`/api/dropbox/auth?user_id=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to get Dropbox auth URL:", errorText);
        return;
      }

      const { url } = await response.json();
      if (!url) {
        console.error("❌ No redirect URL returned from server");
        return;
      }

      console.log("✅ Redirecting to Dropbox OAuth:", url);
      window.location.assign(url);
    } catch (err) {
      console.error("❌ Error in handleConnectDropbox:", err);
    }
  };

  const chooseFolder = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (chooserReady && window.Dropbox) {
      window.Dropbox.choose({
        folderselect: true,
        multiselect: false,
        success: ([folder]: any) => setter(folder.path_display),
      });
    } else {
      alert("Dropbox Chooser not ready yet. Please wait.");
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !token || !inputFolder) return;
    const newUploads: UploadFile[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      progress: 0,
      url: null,
      error: false,
    }));
    setUploadFiles((prev) => [...prev, ...newUploads]);
    newUploads.forEach(uploadToDropbox);
  };

  const uploadToDropbox = (upload: UploadFile) => {
    if (!token || !inputFolder) return;
    const dropboxPath = `${inputFolder}/${upload.file.name}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://content.dropboxapi.com/2/files/upload");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader(
      "Dropbox-API-Arg",
      JSON.stringify({ path: dropboxPath, mode: "add", autorename: true, mute: false })
    );

    xhr.upload.onprogress = (e) => {
      const pct = Math.round((e.loaded / e.total) * 100);
      setUploadFiles((prev) =>
        prev.map((u) => (u.id === upload.id ? { ...u, progress: pct } : u))
      );
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const info = JSON.parse(xhr.responseText);
        const res = await fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: info.path_display }),
        });
        const data = await res.json();
        setUploadFiles((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, url: data.link, progress: 100 } : u
          )
        );
      } else {
        setUploadFiles((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, error: true } : u))
        );
      }
    };

    xhr.onerror = () => {
      setUploadFiles((prev) =>
        prev.map((u) => (u.id === upload.id ? { ...u, error: true } : u))
      );
    };

    xhr.send(upload.file);
  };

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((u) => u.id !== id));
  };

  const handleGenerate = async () => {
    if (!userId) return;
    const imageUrls = uploadFiles.filter((u) => u.url).map((u) => u.url!) as string[];
    const res = await fetch("/api/seedance/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, imageUrls }),
    });
    if (!res.ok) {
      alert("Failed to generate video.");
      return;
    }
    const { jobId } = await res.json();
    router.push(`/dashboard/job/${jobId}`);
  };

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  const hasImages = uploadFiles.some((u) => u.url);

  return (
    <main className="p-6 space-y-8 max-w-[900px] mx-auto">
      <Card className="flex flex-col items-center space-y-4 p-8 bg-surface-primary">
        <img src="/dropbox-logo.svg" alt="Dropbox" className="h-12 w-12" />
        <h2 className="text-2xl font-semibold text-text-primary">
          {token ? "Dropbox Connected" : "Connect Your Dropbox"}
        </h2>
        <Button
          variant={token ? "secondary" : "default"}
          className="w-full max-w-xs flex items-center justify-center gap-2"
          onClick={connectDropbox}
        >
          {token ? "Re-connect Dropbox" : "Connect Dropbox"}
        </Button>

        {token && (
          <div className="w-full max-w-xs text-left">
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

      {/* Additional UI logic for uploads and generate button remains unchanged */}
    </main>
  );
}
