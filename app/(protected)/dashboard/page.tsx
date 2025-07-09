"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DropboxOAuthButton from "@/components/DropboxOAuthButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropboxToken, setDropboxToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndToken = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email);

      const { data, error } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .maybeSingle(); // ✅ allow 0 or 1 rows without throwing

      if (error) {
        console.error("Error fetching Dropbox token:", error.message);
      }

      setDropboxToken(data?.access_token ?? null);
    };

    fetchUserAndToken();
  }, [router]);

  return (
    <main className="p-8 space-y-6">
      <Card className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Welcome</h2>
          <p>{userEmail}</p>
        </div>
        <form action="/auth/signout" method="post">
          <Button variant="outline" type="submit">
            Log out
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dropbox Integration</h3>
        <DropboxOAuthButton userId={userId} accessToken={dropboxToken} />
      </Card>
    </main>
  );
}
