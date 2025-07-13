"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePromptInput } from "@/stores/promptInputStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: Props) {
  const [localValue, setLocalValue] = useState(value);
  const { setPrompt } = usePromptInput();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue); // Push value back to parent
    setPrompt(newValue); // Optional: also update global prompt state
  };

  return (
    <div className="space-y-2">
      <label htmlFor="prompt" className="text-sm font-medium">
        Prompt
      </label>
      <Input
        id="prompt"
        value={localValue}
        onChange={handleInputChange}
        placeholder="Describe your video idea or use a template above"
      />
    </div>
  );
}
