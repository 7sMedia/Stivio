"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxFileList from "@/components/DropboxFileList";
import UserGeneratedVideos from "@/components/UserGeneratedVideos";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email ?? "");
      setLoading(false);
    };

    init();
  }, [router]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-8">
      {/* Left column */}
      <div className="space-y-6">
        {/* Welcome + Dropbox Connect */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-lg font-semibold">Welcome back!</div>
            <div className="text-sm text-muted-foreground">{email}</div>
            <DropboxConnectButton userId={userId} />
          </CardContent>
        </Card>

        {/* Placeholder for Latest Videos */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="h-32 flex items-center justify-center text-white bg-[#1f1f1f]">
            Video 1
          </Card>
          <Card className="h-32 flex items-center justify-center text-white bg-[#1f1f1f]">
            Video 2
          </Card>
        </div>

        {/* Your Generated Videos */}
        <UserGeneratedVideos />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Dropbox Folder Picker */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
            <DropboxFolderPicker userId={userId} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom full-width: File List */}
      <div className="col-span-1 lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
            <DropboxFileList userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
