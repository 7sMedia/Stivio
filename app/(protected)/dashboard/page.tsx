"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxConnectButton from "@/components/DropboxConnectButton"; // ✅ fixed default import
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxFileList from "@/components/DropboxFileList";
import UserGeneratedVideos from "@/components/UserGeneratedVideos";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }

      const currentUser = session?.user;
      setUserId(currentUser?.id ?? null);

      const { data, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", currentUser?.id)
        .single();

      if (tokenError) {
        console.error("Error fetching token:", tokenError.message);
      } else {
        setAccessToken(data?.access_token ?? null);
      }
    };

    fetchSession();
  }, []);

  const handleProcessFile = (filePath: string) => {
    console.log("Process file:", filePath);
    // hook up to Seedance or backend
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-black">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <Card className="mb-6 bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-lg">Dropbox Connection</p>
            <p className="text-sm text-zinc-400">
              Connect your Dropbox to start importing images.
            </p>
          </div>
          <DropboxConnectButton />
        </CardContent>
      </Card>

      {accessToken && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
              <DropboxFolderPicker accessToken={accessToken} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
              <DropboxFileList userId={userId ?? ""} onProcessFile={handleProcessFile} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Generated Videos</h2>
              {userId && <UserGeneratedVideos userId={userId} />}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
