"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import { CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("No Dropbox token found:", error.message);
        setToken(null);
      } else {
        setToken(data?.access_token ?? null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  const handleDisconnect = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("dropbox_tokens")
      .delete()
      .eq("user_id", userId);

    if (!error) {
      setToken(null);
      alert("Dropbox disconnected.");
    } else {
      console.error("Failed to disconnect Dropbox:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-white">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-black text-white flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-center">Welcome to Beta7 Dashboard</h1>
      <Card className="p-6 w-full max-w-xl flex flex-col items-center gap-4 bg-surface-primary text-white border border-gray-700">
        <h2 className="text-2xl font-semibold">Dropbox Connection</h2>

        {token ? (
          <>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={24} /> <span>Dropbox is connected.</span>
            </div>
            <Button
              variant="destructive"
              className="w-full max-w-sm"
              onClick={handleDisconnect}
            >
              Disconnect Dropbox
            </Button>

            {/* Step 2: Folder Picker */}
            <div className="w-full mt-6">
              <DropboxFolderPicker accessToken={token} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-yellow-300">
              <XCircle size={24} /> <span>Dropbox not connected.</span>
            </div>
            <DropboxConnectButton userId={userId} />
          </>
        )}
      </Card>
    </div>
  );
}
