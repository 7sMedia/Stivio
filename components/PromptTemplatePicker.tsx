"use client";

import React, { useState } from "react";

interface PromptTemplatePickerProps {
  setPrompt: (templatePrompt: string) => void;
}

const templates = [
  "Make the photo come alive with flowing motion and vibrant animation.",
  "Add {text} in bold letters that animate onto the screen.",
  "Create a dynamic zoom and pan effect with dramatic lighting.",
  "Give the scene a cinematic look with slow-motion depth.",
  "Animate the background with gentle parallax movement.",
  "Make the person blink and subtly move their head.",
  "Apply a glitch transition with modern energy.",
];

export default function PromptTemplatePicker({ setPrompt }: PromptTemplatePickerProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-white">Prompt Templates</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {templates.map((template, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(template);
              setActiveIdx(idx);
            }}
            className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm border transition-all ${
              activeIdx === idx
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {template.includes("{text}") ? (
              <span>
                {template.replace("{text}", "your custom text")}
                <span className="ml-1 text-yellow-400">*</span>
              </span>
            ) : (
              template
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
