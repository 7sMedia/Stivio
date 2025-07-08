"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DropboxImageUploader from "@/components/DropboxImageUploader";

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
    <div className="min-h-screen bg-black text-white py-10 px-6 md:px-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {!token ? (
        <Card className="mb-6 bg-[#1c1c1c]">
          <CardContent className="p-6">
            <p className="mb-4 text-lg">Connect your Dropbox account to continue.</p>
            <Button
              onClick={() => router.push("/connect-dropbox")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Connect Dropbox
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upload Panel */}
          <Card className="mb-6 bg-[#1c1c1c]">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-3">Upload Images</h2>
              <DropboxImageUploader accessToken={token} />
            </CardContent>
          </Card>

          {/* Prompt Input */}
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

          {/* Recent Jobs (Placeholder) */}
          <Card className="mb-6 bg-[#1c1c1c]">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-3">Recent Jobs</h2>
              <p className="text-gray-400">Coming soon...</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
