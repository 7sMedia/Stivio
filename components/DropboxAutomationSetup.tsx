"use client";

import { useState } from "react";

interface Props {
  userId: string;
  accessToken: string;
  folderPath: string;
}

export default function DropboxAutomationSetup({ userId, accessToken, folderPath }: Props) {
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleSave = async () => {
    if (!prompt.trim()) return;
    setStatus("saving");

    try {
      const res = await fetch("/api/automation-config/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dropbox_folder: folderPath,
          prompt,
          template,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        throw new Error("Failed to save config");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Prompt / Instructions
        </label>
        <textarea
          className="w-full bg-zinc-800 text-white p-2 rounded"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how you want the image to animate..."
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Optional: Seedance Template ID
        </label>
        <input
          type="text"
          className="w-full bg-zinc-800 text-white p-2 rounded"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="e.g. seedance-fast-flow-v1"
        />
      </div>

      <button
        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded text-sm"
        onClick={handleSave}
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving..." : "Save Automation Setup"}
      </button>

      {status === "success" && <p className="text-green-400 text-sm">✅ Config saved!</p>}
      {status === "error" && <p className="text-red-500 text-sm">❌ Error saving config.</p>}
    </div>
  );
}
