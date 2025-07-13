"use client";

import { useState } from "react";
import { PROMPT_TEMPLATES } from "./promptTemplates";

interface PromptTemplatePickerProps {
  onSelectTemplate: (template: { title: string; prompt: string }) => void;
}

export default function PromptTemplatePicker({
  onSelectTemplate,
}: PromptTemplatePickerProps) {
  const [filter, setFilter] = useState<"all" | "animation" | "text">("all");

  const filteredTemplates =
    filter === "all"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.type === filter);

  return (
    <div className="mb-4 space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2">
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
          Text Only
        </button>
      </div>

      {/* Template Cards */}
      <div className="space-y-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.title}
            className="border border-zinc-700 rounded p-4 bg-zinc-900 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">{tpl.title}</h3>
              <button
                onClick={() =>
                  onSelectTemplate({ title: tpl.title, prompt: tpl.prompt })
                }
                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                Use Template
              </button>
            </div>
            <p className="text-zinc-400 mt-2 text-sm">{tpl.prompt}</p>
            {tpl.description && (
              <details className="mt-3 text-sm text-zinc-400">
                <summary className="cursor-pointer text-indigo-400">
                  Show Tips
                </summary>
                <p className="mt-1 whitespace-pre-wrap">{tpl.description}</p>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
