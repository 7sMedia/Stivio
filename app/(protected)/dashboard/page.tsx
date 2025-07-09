"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, XCircle } from "lucide-react";
import Sidebar from "@/components/sidebar";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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

      setIsConnected(!!data?.access_token);
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
      } else {
        console.error("Failed to disconnect:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error during disconnect:", err);
    }
  };

  return (
    <div className="flex min-h-screen dark bg-background text-white">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardContent className="py-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Welcome to Beta7</h2>
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
                    href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI}&response_type=code&state=${userId}&force_reapprove=true`}
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

        {/* Step 2: Folder Picker if connected */}
        {isConnected && userId && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Select Input Folder</h3>
            <DropboxFolderPicker userId={userId} />
          </div>
        )}
      </main>
    </div>
  );
}
