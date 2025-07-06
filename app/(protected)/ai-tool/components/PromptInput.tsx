// /app/ai-tool/components/PromptInput.tsx
"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function PromptInput({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Describe the animation (e.g., make her smile and blink)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={120}
        className="w-full px-4 py-3 rounded-lg border border-indigo-500 bg-indigo-900 text-indigo-100 placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
    </div>
  );
}
