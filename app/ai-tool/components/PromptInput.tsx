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
        className="input input-bordered w-full"
        maxLength={120}
      />
    </div>
  );
}
