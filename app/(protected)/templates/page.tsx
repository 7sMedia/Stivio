"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TemplatesPage() {
  const templates = [
    { id: "split-2", title: "2-Way Split", description: "Side-by-side layout" },
    { id: "split-3", title: "3-Way Split", description: "Three columns layout" },
    { id: "pip", title: "Picture-in-Picture", description: "Main + inset view" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Templates Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="hover:shadow-lg transition-shadow">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">{tpl.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tpl.description}</p>
              <div className="aspect-video bg-gray-800 rounded">
                {/* TODO: live preview or thumbnail */}
              </div>
              <Button className="mt-4" onClick={() => {/* load template */}}>
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
