// /app/ai-tool/PromptTemplatePicker.tsx

"use client";
import { useState } from "react";
import { PROMPT_TEMPLATES } from "./promptTemplates";

export default function PromptTemplatePicker({
  setPrompt,
}: {
  setPrompt: (prompt: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "animation" | "text">("all");

  const filteredTemplates =
    filter === "all"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.type === filter);

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          type="button"
        >
          All
        </button>
        <button
          onClick={() => setFilter("animation")}
          className={`px-3 py-1 rounded ${
            filter === "animation"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          type="button"
        >
          Animation Only
        </button>
        <button
          onClick={() => setFilter("text")}
          className={`px-3 py-1 rounded ${
            filter === "text"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          type="button"
        >
          With Text Overlay
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {filteredTemplates.map((tpl) => (
          <button
            key={tpl.title}
            onClick={() => setPrompt(tpl.prompt)}
            className="bg-gray-800 px-3 py-2 rounded text-sm hover:bg-indigo-600 transition"
            title={tpl.description}
            type="button"
          >
            {tpl.title}
          </button>
        ))}
      </div>
    </div>
  );
}
