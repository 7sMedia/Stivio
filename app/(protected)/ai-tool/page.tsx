"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ImageUpload from "@/components/ImageUpload";

export default function AIToolPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropboxData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token, input_folder")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error("Dropbox info not found:", error);
        return;
      }

      setAccessToken(data.access_token);
      setInputFolder(data.input_folder);
      setLoading(false);
    };

    fetchDropboxData();
  }, []);

  if (loading || !accessToken || !inputFolder) {
    return <div className="p-6 text-sm text-muted-foreground">Loading Dropbox integration…</div>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">AI Tool: Upload Images</h1>
      <ImageUpload dropboxAccessToken={accessToken} inputFolderPath={inputFolder} />
    </main>
  );
}
