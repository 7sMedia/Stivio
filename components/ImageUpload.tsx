// components/ImageUploader.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToDropbox } from "@/lib/dropboxUpload";
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react";

export default function ImageUploader({
  inputFolderPath,
}: {
  inputFolderPath: string;
}) {
  const [images, setImages] = useState<
    { id: string; name: string; path: string; preview: string }[]
  >([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const name = file.name;
        const exists = images.find((img) => img.name === name);
        if (exists) continue;

        const preview = URL.createObjectURL(file);
        const tempId = crypto.randomUUID();

        // Optimistically add to UI
        setImages((prev) => [
          ...prev,
          { id: tempId, name, path: "", preview },
        ]);

        // Upload to Dropbox
        const dropboxPath = `${inputFolderPath}/${name}`;
        const res = await uploadToDropbox(file, dropboxPath);

        if (res.success) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === tempId
                ? { ...img, path: dropboxPath }
                : img
            )
          );
        }
      }
    },
    [images, inputFolderPath]
  );

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRename = (id: string) => {
    const newName = prompt("Enter new name (keep .jpg/.png):");
    if (!newName) return;
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        <p>Drag and drop images here, or click to select</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border rounded overflow-hidden"
          >
            <Image
              src={img.preview}
              alt={img.name}
              width={200}
              height={200}
              className="object-cover"
            />
            <div className="absolute top-1 right-1 flex space-x-1 bg-black bg-opacity-50 p-1 rounded">
              <button onClick={() => handleRename(img.id)}>
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(img.id)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="text-xs truncate px-1 pb-1 text-center">{img.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
