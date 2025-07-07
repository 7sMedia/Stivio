"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PromptBuilderPage() {
  // Example block types
  const availableBlocks = [
    { id: "text", label: "Text" },
    { id: "image", label: "Image" },
    { id: "transition", label: "Transition" },
  ];

  // State for blocks in the canvas
  const [blocks, setBlocks] = useState<{ id: string; type: string }[]>([]);

  const addBlock = (type: string) => {
    setBlocks((prev) => [...prev, { id: `${type}-${Date.now()}`, type }]);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Block Palette */}
      <aside className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Blocks</h2>
        <div className="space-y-2">
          {availableBlocks.map((blk) => (
            <Button
              key={blk.id}
              variant="outline"
              className="w-full"
              onClick={() => addBlock(blk.id)}
            >
              {blk.label}
            </Button>
          ))}
        </div>
      </aside>

      {/* Canvas Preview */}
      <section className="col-span-2 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Canvas</h2>
        <div className="flex-1 overflow-auto border rounded bg-gray-800 p-4 space-y-4">
          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add blocks from the left to build your prompt.</p>
          ) : (
            blocks.map((blk) => (
              <Card key={blk.id} className="bg-gray-900">
                <CardContent>
                  <p className="text-sm">{blk.type.toUpperCase()} Block</p>
                  <Input placeholder={`Edit ${blk.type} details…`} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Run Prompt</Button>
        </div>
      </section>
    </div>
  );
}
