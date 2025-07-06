"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Loader2 } from "lucide-react";

export default function AIToolPage() {
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [inputFolder, setInputFolder] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        window.location.href = "/login";
        return;
      }

      const user = data.session.user;
      const metadata = user.user_metadata;
      const token = metadata?.dropbox_access_token;
      const folder = metadata?.dropbox_input_folder;

      if (!token || !folder) {
        toast({
          title: "Dropbox not connected",
          description: "Please connect Dropbox in settings first.",
          variant: "destructive",
        });
        return;
      }

      setAccessToken(token);
      setInputFolder(folder);
      setSessionLoaded(true);
    };

    fetchSession();
  }, [toast]);

  if (!sessionLoaded) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Upload images to your Dropbox folder: <strong>{inputFolder}</strong>
      </p>

      <ImageUpload
        inputFolderPath={inputFolder}
        accessToken={accessToken || undefined}
      />
    </div>
  );
}
