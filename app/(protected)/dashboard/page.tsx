"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropboxOAuthButton } from "@/components/DropboxOAuthButton";
import { DropboxFileList } from "@/components/DropboxFileList";
import { DropboxFolderPicker } from "@/components/DropboxFolderPicker";
import { UploadCloud } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import PromptInput from "@/components/PromptInput";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? null);
      setUserId(user.id);

      const { data: tokenData } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

      if (tokenData?.access_token) {
        setToken(tokenData.access_token);
      }

      setLoading(false);
    };

    getUserDetails();
  }, [router]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 space-y-6 text-white">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {userEmail ? `Logged in as ${userEmail}` : ""}
          </p>
          <DropboxOAuthButton userId={userId} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Latest Videos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted h-32 rounded shadow flex items-center justify-center">
              Video 1
            </div>
            <div className="bg-muted h-32 rounded shadow flex items-center justify-center">
              Video 2
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
          <DropboxFolderPicker accessToken={token || ""} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
          <ImageUpload userId={userId!} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Describe Your Video</h2>
          <PromptInput />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
          {userId ? (
            <DropboxFileList userId={userId} onProcessFile={() => {}} />
          ) : (
            <p className="text-red-500">No Dropbox token for user</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
