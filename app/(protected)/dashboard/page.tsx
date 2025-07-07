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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [outputFolder, setOutputFolder] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <div className="p-10 text-text-secondary">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* 1. Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Input
          placeholder="Drop a video link or file here"
          className="
            w-full
            px-4 py-3 rounded-md
            !bg-surface-secondary !text-text-primary
            placeholder:!text-text-muted
            border border-surface-secondary focus:border-accent
            transition
          "
        />

        <Button
          variant="secondary"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Upload (Dropbox)</span>
        </Button>
      </div>

      {/* 2. Quick-access tool icons */}
      <div className="flex flex-wrap gap-4">
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
            className="flex items-center gap-2 bg-surface-primary p-4 cursor-pointer hover:border-accent border border-surface-secondary transition"
          >
            <div className="text-accent">{tool.icon}</div>
            <span className="text-text-primary font-medium">{tool.label}</span>
          </Card>
        ))}
      </div>

      {/* 3. Projects grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">All Projects</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Saved
            </Button>
            <Button variant="ghost" size="sm">
              Favorites
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="h-32 bg-surface-secondary cursor-pointer hover:border-accent border border-surface-secondary transition"
            >
              <div className="flex h-full items-center justify-center text-text-secondary">
                Project {i + 1}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Dropbox & Upload panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-surface-primary">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">
            Dropbox Folder Setup
          </h3>
          <div className="space-y-4">
            <label className="block text-sm text-text-secondary">Input Folder</label>
            <Button variant="outline" className="w-full">
              {inputFolder ?? "Select Input Folder"}
            </Button>
          </div>
          <div className="space-y-4">
            <label className="block text-sm text-text-secondary">Output Folder</label>
            <Button variant="outline" className="w-full">
              {outputFolder ?? "Select Output Folder"}
            </Button>
          </div>
        </Card>

        <Card className="bg-surface-primary">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">
            Upload Images
          </h3>
          <label
            htmlFor="upload"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-surface-secondary rounded-lg p-6 cursor-pointer hover:border-accent transition text-text-secondary"
          >
            <UploadCloud className="w-6 h-6 text-accent" />
            <span>Drag &amp; drop or click to upload .jpg, .jpeg, .png</span>
          </label>
          <Input id="upload" type="file" multiple accept=".jpg,.jpeg,.png" className="hidden" />
        </Card>
      </div>
    </div>
  );
}
