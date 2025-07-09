"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import DropboxFileList from "@/components/DropboxFileList";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/");
        return;
      }

      setUserEmail(user.email);
      setUserId(user.id);

      const { data: tokenData } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

      setToken(tokenData?.access_token || null);
      setLoading(false);
    };

    getUserData();
  }, [router]);

  const handleConnectDropbox = () => {
    window.location.href = `/api/dropbox/oauth/start?user_id=${userId}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen text-white">
      <div className="w-64 bg-black p-4 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-6">Beta7</div>
          <div className="mb-2">Dashboard</div>
          <div className="mb-2">AI Tool</div>
        </div>
        <div>
          <div className="text-sm mb-2">{userEmail}</div>
          <Button onClick={handleLogout} className="w-full" variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        {token ? (
          <div className="text-green-500 text-sm">Dropbox connected</div>
        ) : (
          <Button onClick={handleConnectDropbox} className="bg-cyan-400 w-full">
            Connect Dropbox
          </Button>
        )}

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Your Latest Videos</h3>
              <div className="flex gap-4">
                <div className="w-1/2 h-32 bg-gray-800 rounded flex items-center justify-center">Video 1</div>
                <div className="w-1/2 h-32 bg-gray-800 rounded flex items-center justify-center">Video 2</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h3>
              <DropboxFolderPicker accessToken={token || ""} userId={userId || ""} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
            <DropboxImageUploader accessToken={token || ""} userId={userId || ""} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Describe Your Video</h3>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a fast-paced ad for a beach resort with upbeat music."
              className="mb-4"
            />
            <Button className="bg-green-600">Generate Video</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h3>
            {userId ? (
              <DropboxFileList userId={userId} onProcessFile={() => {}} />
            ) : (
              <p className="text-red-500">No Dropbox token for user</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
