// app/(protected)/ai-tool/history/page.tsx

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const id = session?.session?.user?.id;
      if (!id) return;
      setUserId(id);

      const { data, error } = await supabase
        .from("generated_videos")
        .select("id, prompt, uuid, filename, dropbox_path, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setVideos(data || []);
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Video History</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="bg-[#111827]">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-zinc-400">Prompt:</p>
              <p className="text-white">{video.prompt}</p>
              <p className="text-sm text-zinc-500">Created: {new Date(video.created_at).toLocaleString()}</p>
              <a
                href={`https://www.dropbox.com/home${video.dropbox_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="w-full">
                  Open in Dropbox
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
