// ✅ File: app/(protected)/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropboxConnectButton from "@/components/DropboxConnectButton";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome to Beta7</h1>
          <DropboxConnectButton />
        </div>
      </Card>
      {/* Additional sections like folder picker, upload, prompt input, etc. */}
    </div>
  );
}
