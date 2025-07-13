// components/PromptTemplatePicker.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePromptInput } from '@/stores/promptInputStore';

const templates = [
  {
    title: 'Automotive Performance Ad',
    prompt:
      'Create a 15-second video for a high-performance car shop showcasing turbo installs and dyno runs. Use fast cuts and energetic music. Add call-to-action text at the end.',
  },
  {
    title: 'Real Estate Listing Promo',
    prompt:
      'Create a cinematic video for a luxury home listing with sweeping shots, soft background music, and elegant transitions. Include price, location, and agent contact info.',
  },
  {
    title: 'Barbershop Promo',
    prompt:
      'Create a video ad for a trendy barbershop with clips of fades, beard trims, and satisfied customers. Add upbeat music and text overlays showing the shop name and hours.',
  },
];

export default function PromptTemplatePicker() {
  const { setPrompt } = usePromptInput();

  const handleClick = (template: string) => {
    setPrompt(template);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Prompt Templates</h2>
      <ScrollArea className="h-[220px] w-full rounded-md border">
        <div className="p-2 space-y-2">
          {templates.map((template, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => handleClick(template.prompt)}
            >
              <CardContent className="p-4">
                <p className="font-medium">{template.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.prompt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
