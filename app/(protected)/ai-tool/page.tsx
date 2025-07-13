"use client";

import { useState } from "react";
import PromptTemplatePicker from "./PromptTemplatePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";

export default function AIToolPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Create AI-Powered Videos</h1>
      <p className="text-muted-foreground mb-4">
        Choose a prompt template, customize it, and upload an image to generate stunning AI content.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Prompt Templates */}
        <div className="space-y-4">
          <PromptTemplatePicker onSelectTemplate={(tpl) => {
            setPrompt(tpl.prompt);
            setSelectedTemplate(tpl.name);
          }} />
        </div>

        {/* Right: Prompt Input + Upload */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">Prompt</label>
          <Textarea
            className="min-h-[120px] text-white"
            placeholder="Describe what you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-white block mb-2">Upload Image</label>
            <ImageUpload inputFolderPath="/testing" />
          </div>

          <Button className="w-full">
            Generate Video
          </Button>
        </div>
      </div>
    </div>
  );
}
