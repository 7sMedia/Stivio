"use client";

import React from "react";

interface PromptTemplatePickerProps {
  setPrompt: (templatePrompt: string) => void;
}

const promptTemplates = [
  {
    title: "Auto Performance Reel",
    prompt: "Create a dynamic video ad showcasing a high-performance car with aggressive transitions, cinematic zooms, and upbeat music. Highlight power, speed, and modifications.",
    description: "For car tuning shops or performance brands."
  },
  {
    title: "Real Estate Walkthrough",
    prompt: "Generate a cinematic walkthrough of a luxury property. Include smooth pan shots, elegant transitions, soft background music, and key selling points as text overlays.",
    description: "Perfect for realtors, Airbnb, or home tours."
  },
  {
    title: "Local Business Promo",
    prompt: "Create a short promo for a local business. Use upbeat music, quick cuts of services, smiling staff, and contact info at the end.",
    description: "Ideal for barbers, cafes, gyms, etc."
  }
];

export default function PromptTemplatePicker({ setPrompt }: PromptTemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {promptTemplates.map((template, idx) => (
        <button
          key={idx}
          onClick={() => setPrompt(template.prompt)}
          className="rounded-2xl bg-muted p-4 text-left transition-all hover:bg-muted/60 hover:shadow-md border border-border"
        >
          <div className="font-semibold text-base mb-2">{template.title}</div>
          <div className="text-sm text-muted-foreground mb-1">{template.description}</div>
          <div className="text-xs text-muted-foreground italic">{template.prompt}</div>
        </button>
      ))}
    </div>
  );
}
