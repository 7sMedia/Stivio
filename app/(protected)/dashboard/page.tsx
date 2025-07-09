"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import DropboxFileList from "@/components/DropboxFileList";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      const id = session.user.id;
      setUserId(id);

      const { data, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!tokenError && data?.access_token) {
        setToken(data.access_token);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  if (loading) return <div className="text-center text-white p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-[#111] p-6 hidden md:block">
        <div className="font-bold text-lg mb-4">Beta7</div>
        <nav>
          <ul className="space-y-3">
            <li><a className="hover:text-gray-300" href="/dashboard">Dashboard</a></li>
            <li><a className="hover:text-gray-300" href="/ai-tool">AI Tool</a></li>
          </ul>
        </nav>
        <div className="absolute bottom-6 left-6 text-sm text-gray-400">jay7nyc@hotmail.com</div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>

        <div className="mb-6">
          {!token ? (
            <Button
              onClick={() => router.push("/connect-dropbox")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Connect Dropbox (Auto Sync)
            </Button>
          ) : (
            <div className="text-sm text-green-400 mb-2">Dropbox connected</div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-[#1c1c1c]">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Latest Videos</h2>
              <div className="flex space-x-4">
                <div className="bg-[#2a2a2a] rounded-md w-1/2 h-32 flex items-center justify-center text-gray-400">Video 1</div>
                <div className="bg-[#2a2a2a] rounded-md w-1/2 h-32 flex items-center justify-center text-gray-400">Video 2</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1c1c1c]">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
              <DropboxFolderPicker accessToken={token || ""} userId={userId || ""} />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-[#1c1c1c]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">Upload Images</h2>
            <DropboxImageUploader accessToken={token || ""} />
          </CardContent>
        </Card>

        <Card className="mb-6 bg-[#1c1c1c]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">Describe Your Video</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. Create a fast-paced ad for a beach resort with upbeat music."
              className="w-full p-4 rounded-md text-black"
            />
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
              Generate Video
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-[#1c1c1c]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
            {userId ? (
              <DropboxFileList userId={userId} onProcessFile={() => {}} />
            ) : (
              <p className="text-red-500">No Dropbox token for user</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
