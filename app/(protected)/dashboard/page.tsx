"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropboxConnectButton from "@/components/DropboxConnectButton";
import DropboxFolderPicker from "@/components/DropboxFolderPicker";
import DropboxImageUploader from "@/components/DropboxImageUploader";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import PromptTemplatePicker from "@/components/PromptTemplatePicker";
import { logout } from "@/lib/logout";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
    };

    fetchUserId();
  }, [router]);

  return (
    <div className="space-y-6 px-6 py-10">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome to Beta7</h1>
          {userId && <DropboxConnectButton userId={userId} />}
        </div>
      </Card>

      <Card className="p-6">
        <DropboxFolderPicker
          userId={userId}
          value={selectedFolder}
          onChange={(val: string) => setSelectedFolder(val)}
        />
      </Card>

      <Card className="p-6">
        <DropboxImageUploader folderPath={selectedFolder} />
      </Card>

      <Card className="p-6">
        <PromptTemplatePicker onSelectTemplate={(val) => setPrompt(val)} />
      </Card>

      <Card className="p-6">
        <PromptInput value={prompt} onChange={setPrompt} />
      </Card>

      <Card className="p-6">
        <GenerateButton folderPath={selectedFolder} prompt={prompt} />
      </Card>

      <Card className="p-6">
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
