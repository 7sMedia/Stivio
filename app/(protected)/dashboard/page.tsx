"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  UploadCloud,
  Grid,
  BarChart2,
  Users,
  Folder,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    Dropbox: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [outputFolder, setOutputFolder] = useState<string | null>(null);

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

  // On mount: auth check + token lookup
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        const uid = data.session.user.id;
        setUserId(uid);
        // check existing token
        const { data: rows } = await supabase
          .from("dropbox_tokens")
          .select("access_token")
          .eq("user_id", uid)
          .limit(1);
        setConnected(Array.isArray(rows) && rows.length > 0);
        setLoading(false);
      }
    });
  }, [router]);

  // Listen for popup success message
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "dropbox-connected") {
        setConnected(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  // Start OAuth popup
  const connectDropbox = () => {
    if (!userId) return;
    window.open(
      `/api/dropbox/oauth?state=${encodeURIComponent(userId)}`,
      "dropboxAuth",
      "width=600,height=700"
    );
  };

  // Folder chooser wrapper
  const chooseFolder = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (window.Dropbox) {
      window.Dropbox.choose({
        folderselect: true,
        multiselect: false,
        success: ([folder]: any) => setter(folder.name),
        cancel: () => {},
      });
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* 1. Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Input
          placeholder="Drop a video link or file here"
          className="w-full px-4 py-3 bg-surface-secondary text-text-primary placeholder:text-text-muted border border-surface-secondary rounded-md focus:border-accent transition"
        />
        <Button variant="secondary" className="flex-shrink-0 flex items-center gap-2 px-4 py-3">
          <UploadCloud className="w-5 h-5" />
          <span>Upload (Dropbox)</span>
        </Button>
      </div>

      {/* 2. Quick-access tool icons */}
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {[ 
          { icon: <Grid />, label: "Long to shorts" },
          { icon: <BarChart2 />, label: "AI Captions" },
          { icon: <Users />, label: "Enhance speech" },
          { icon: <Folder />, label: "AI Reframe" },
          { icon: <Calendar />, label: "AI B-Roll" },
          { icon: <HelpCircle />, label: "AI hook" },
        ].map((tool) => (
          <Card
            key={tool.label}
            className="inline-flex items-center gap-2 bg-surface-primary p-3 cursor-pointer hover:border-accent border border-surface-secondary transition"
          >
            <div className="text-accent">{tool.icon}</div>
            <span className="text-text-primary font-medium">{tool.label}</span>
          </Card>
        ))}
      </div>

      {/* 3. Projects carousel placeholder */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">All Projects</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Saved</Button>
            <Button variant="ghost" size="sm">Favorites</Button>
          </div>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="flex-shrink-0 w-40 h-24 bg-surface-secondary cursor-pointer hover:border-accent border border-surface-secondary transition"
            >
              <div className="flex h-full items-center justify-center text-text-secondary">
                Project {i + 1}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Dropbox Folder Setup */}
      <Card className="bg-surface-primary p-6 space-y-4">
        <Button
          variant={connected ? "secondary" : "default"}
          className="w-full"
          onClick={connectDropbox}
        >
          {connected ? "Re-connect Dropbox" : "Connect Dropbox"}
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Input Folder</label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => chooseFolder(setInputFolder)}
              disabled={!connected}
            >
              {inputFolder ?? "Select Input Folder"}
            </Button>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Output Folder</label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => chooseFolder(setOutputFolder)}
              disabled={!connected}
            >
              {outputFolder ?? "Select Output Folder"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
