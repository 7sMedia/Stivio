"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ImageThumbnailProps {
  name: string;
  src: string;
  onRename: () => void;
  onDelete: () => void;
}

export default function ImageThumbnail({
  name,
  src,
  onRename,
  onDelete,
}: ImageThumbnailProps) {
  return (
    <div className="relative rounded overflow-hidden shadow border border-zinc-700 bg-zinc-900">
      <Image
        src={src}
        alt={name}
        width={200}
        height={200}
        className="object-cover w-full h-[150px]"
      />
      <div className="p-2 flex items-center justify-between text-sm">
        <span className="truncate max-w-[130px]" title={name}>
          {name}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-xs"
            onClick={onRename}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-xs"
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
