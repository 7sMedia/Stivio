"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxFileList from "@/components/DropboxFileList";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("dropbox_tokens")
          .select("access_token")
          .eq("user_id", user.id)
          .single();

        if (data && data.access_token) {
          setAccessToken(data.access_token);
        }
      }
    };

    getUserInfo();
  }, []);

  return (
    <div className="p-4 space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p>Your email: {userId}</p>
          <DropboxConnectButton userId={userId ?? ""} />
        </CardContent>
      </Card>

      {accessToken && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dropbox Folder Picker</h2>
            <DropboxFolderPicker accessToken={accessToken} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
          <DropboxFileList
            userId={userId ?? ""}
            onProcessFile={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}
