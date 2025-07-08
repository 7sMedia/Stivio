// app/(protected)/ai-tool/page.tsx
"use client";

import ImageUpload from "@/components/ImageUpload";

export default function AIToolPage() {
  const inputFolderPath = "/testing";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Upload Images</h1>
      <ImageUpload inputFolderPath={inputFolderPath} />
    </div>
  );
}
