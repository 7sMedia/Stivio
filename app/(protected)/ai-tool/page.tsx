// app/(protected)/ai-tool/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";

export default function AIToolPage() {
  const { toast } = useToast();
  const [inputFolderPath, setInputFolderPath] = useState<string | null>(null);

  useEffect(() => {
    const getUserFolders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Not signed in",
          description: "Redirecting to login...",
          variant: "error",
        });
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("input_folder")
        .eq("user_id", user.id)
        .single();

      if (error || !data?.input_folder) {
        toast({
          title: "Folder not found",
          description: "Please select an input folder.",
          variant: "error",
        });
        return;
      }

      setInputFolderPath(data.input_folder);
    };

    getUserFolders();
  }, [toast]);

  if (!inputFolderPath) {
    return (
      <div className="p-6 text-center text-zinc-400">
        Loading input folder...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Upload Images</h1>
      <ImageUpload inputFolderPath={inputFolderPath} />
    </div>
  );
}
