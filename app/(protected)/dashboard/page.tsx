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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        setUserId(user.id);
      }

      setLoading(false);
    };

    getUserId();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p>Your email: {userId || "Unknown"}</p>
          <div className="mt-4">
            {loading ? (
              <Button disabled className="w-full bg-cyan-400 text-black">
                Loading...
              </Button>
            ) : userId ? (
              <DropboxConnectButton userId={userId} />
            ) : (
              <p className="text-red-500">User not authenticated</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dropbox File Section */}
      <Card>
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
          {userId ? (
            <DropboxFileList userId={userId} />
          ) : (
            <p className="text-red-500">No Dropbox token for user</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
