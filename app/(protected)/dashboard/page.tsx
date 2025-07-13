"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      if (error) {
        console.error("Error checking Dropbox connection:", error);
      }

      if (data?.access_token) {
        setIsConnected(true);
        setAccessToken(data.access_token);
      } else {
        setIsConnected(false);
        setAccessToken(null);
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

      const result = await res.json();

      if (res.ok) {
        setIsConnected(false);
        setAccessToken(null);
      } else {
        console.error("Failed to disconnect:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error during disconnect:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome + Dropbox Connection */}
      <Card>
        <CardContent className="py-6 px-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Piksion</h2>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected ? "✅ Dropbox Connected" : "❌ Not Connected"}
              </p>
            )}
          </div>

          {!loading && (
            isConnected ? (
              <Button variant="destructive" onClick={handleDisconnect}>
                <XCircle className="mr-2 h-4 w-4" />
                Disconnect Dropbox
              </Button>
            ) : (
              userId && (
                <a
                  href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&response_type=code&token_access_type=offline`}
                >
                  <Button>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Connect Dropbox
                  </Button>
                </a>
              )
            )
          )}
        </CardContent>
      </Card>

      {/* Folder Picker */}
      {isConnected && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Choose a Dropbox Folder</h3>
          <DropboxFolderPicker
            accessToken={accessToken!}
            selectedPath={selectedPath}
            onSelectPath={(path) => setSelectedPath(path)}
          />
        </div>
      )}

      {/* Placeholder Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Prompt Input</h4>
              <p className="text-sm text-muted-foreground">Type or choose a prompt template to generate a video.</p>
              {/* Your PromptInput component will go here */}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Video Preview</h4>
              <p className="text-sm text-muted-foreground">Your generated video preview will appear here.</p>
              {/* Your VideoPreview component will go here */}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Job History</h4>
              <p className="text-sm text-muted-foreground">Recent generated videos appear here.</p>
              {/* Your VideoHistory or JobList component will go here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
