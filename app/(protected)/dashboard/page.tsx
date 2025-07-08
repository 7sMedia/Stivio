"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropboxConnectButton } from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxFileList from "@/components/DropboxFileList";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndToken = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
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

    getUserAndToken();
  }, [router]);

  const handleProcessFile = (filePath: string) => {
    console.log("Processing file:", filePath);
    // Add real processing logic here later
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome</h2>
              <p className="text-sm text-muted-foreground">{userId}</p>
            </div>
            <DropboxConnectButton />
          </div>
        </CardContent>
      </Card>

      {token && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
            <DropboxFolderPicker accessToken={token} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
          <DropboxFileList
            userId={userId ?? ""}
            onProcessFile={handleProcessFile}
          />
        </CardContent>
      </Card>
    </div>
  );
}
