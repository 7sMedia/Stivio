// app/(protected)/ai-tool/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";

export default function AIToolPage() {
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href = "/login";
        return;
      }

      const token = user?.user_metadata?.dropboxAccessToken ?? null;
      const folder = user?.user_metadata?.dropboxInputFolder ?? "/Beta7/Images";

      if (!token) {
        toast({
          title: "Dropbox not connected",
          description: "Please connect Dropbox in your settings.",
          variant: "destructive",
        });
        return;
      }

      setAccessToken(token);
      setInputFolder(folder);
      setLoading(false);
    };

    loadUser();
  }, [toast]);

  if (loading || !accessToken || !inputFolder) {
    return <p className="text-center mt-20 text-zinc-400">Loading Dropbox settings...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Image Manager</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Upload, rename, or delete images before generating your video.
      </p>
      <ImageUpload accessToken={accessToken} inputFolder={inputFolder} />
    </div>
  );
}
