File: `app/(protected)/dashboard/page.tsx`

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxFileList from "@/components/DropboxFileList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setEmail(user.email ?? null);
      } else {
        console.error("User not found:", error);
        router.push("/login");
      }
    };

    getUser();
  }, [router]);

  useEffect(() => {
    const fetchDropboxToken = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", userId)
        .single();

      if (data && data.access_token) {
        setToken(data.access_token);
      } else {
        setToken(null);
        if (error) {
          console.warn("Dropbox token not found:", error.message);
        }
      }
    };

    fetchDropboxToken();
  }, [userId]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p className="text-muted-foreground text-sm mb-2">
            User ID: <span className="text-foreground font-mono">{userId ?? "-"}</span>
          </p>
          <p className="text-muted-foreground text-sm mb-2">
            Email: <span className="text-foreground font-mono">{email ?? "-"}</span>
          </p>
          <div className="mt-4">
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

      {userId && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Dropbox Files (Root)</h2>
            <DropboxFileList userId={userId} onProcessFile={() => {}} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```
