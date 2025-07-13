
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { UploadCloud, XCircle } from "lucide-react";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string>("");

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUserId(user.id);
      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.access_token) {
        setIsConnected(true);
        setAccessToken(data.access_token);
      }
      setLoading(false);
    };
    fetchUserAndStatus();
  }, [router]);

  const handleDisconnect = async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/dropbox/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setIsConnected(false);
        setAccessToken(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="px-6 pb-12 space-y-10">
      {/* Welcome Panel */}
      <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl shadow-lg p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Welcome to <span className="text-primary">Piksion</span></h1>
          {!loading && (
            <p className="text-sm text-zinc-400 mt-1">
              {isConnected ? "✅ Dropbox Connected" : "❌ Not Connected"}
            </p>
          )}
        </div>
        {!loading && (
          isConnected ? (
            <Button variant="destructive" onClick={handleDisconnect} className="rounded-xl">
              <XCircle className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            userId && (
              <a
                href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&response_type=code&token_access_type=offline`}
              >
                <Button variant="gradient">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Connect Dropbox
                </Button>
              </a>
            )
          )
        )}
      </div>

      {/* Folder Picker */}
      {userId && isConnected && (
        <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Choose a Dropbox Folder</h3>
          <DropboxFolderPicker
            userId={userId}
            onFolderSelect={(path) => setSelectedPath(path)}
          />
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="col-span-1 xl:col-span-2 space-y-6">
          {/* Prompt Input */}
          <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-semibold text-white mb-2">Prompt Input</h4>
            <p className="text-sm text-zinc-400 mb-4">Enter a detailed prompt or select from templates.</p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-500 text-sm">[ Prompt input field goes here ]</div>
          </div>

          {/* Video Preview */}
          <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-semibold text-white mb-2">Video Preview</h4>
            <p className="text-sm text-zinc-400 mb-4">Your generated video preview will appear below.</p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-500 text-sm">[ Video player or thumbnail preview ]</div>
          </div>
        </div>

        {/* Job History */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-semibold text-white mb-2">Job History</h4>
            <p className="text-sm text-zinc-400 mb-4">Recent video generations:</p>
            <div className="space-y-3">
              <div className="bg-zinc-900 hover:bg-zinc-800 cursor-pointer rounded-xl px-4 py-3 text-sm text-zinc-300 transition">🟢 Generated video 1</div>
              <div className="bg-zinc-900 hover:bg-zinc-800 cursor-pointer rounded-xl px-4 py-3 text-sm text-zinc-300 transition">🟢 Generated video 2</div>
              <div className="bg-zinc-900 hover:bg-zinc-800 cursor-pointer rounded-xl px-4 py-3 text-sm text-zinc-300 transition">🟢 Generated video 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
