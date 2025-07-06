'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // using Shadcn UI
import { Trash, Pencil } from 'lucide-react';

type UploadedImage = {
  file: File;
  preview: string;
  name: string;
};

export default function DropboxImageUploader() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => {
      const existingNames = new Set(prev.map(img => img.name));
      const newImages = acceptedFiles
        .filter(file => !existingNames.has(file.name))
        .filter(file => /\.(jpe?g|png)$/i.test(file.name))
        .map(file => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        }));
      return [...prev, ...newImages];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  const handleDelete = (name: string) => {
    setImages(prev => prev.filter(img => img.name !== name));
  };

  const handleRename = (oldName: string, newName: string) => {
    if (!newName || newName === oldName) return;
    if (images.some(img => img.name === newName)) return alert('Name already in use.');
    setImages(prev =>
      prev.map(img =>
        img.name === oldName ? { ...img, name: newName } : img
      )
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition bg-[#16181f] ${
          isDragActive ? 'border-[#0EC9DB]' : 'border-[#2A2C33]'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-[#b1b2c1]">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop images here, or click to browse (.jpg, .jpeg, .png)'}
        </p>
      </div>

      {/* Uploaded Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
        {images.map((img, idx) => (
          <div
            key={img.name + idx}
            className="relative rounded-lg overflow-hidden shadow border border-[#2A2C33] bg-[#1e1e28]"
          >
            <Image
              src={img.preview}
              alt={img.name}
              width={300}
              height={200}
              className="object-cover w-full h-40"
            />
            <div className="p-2 text-xs text-[#b1b2c1] truncate">
              {img.name}
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  const newName = prompt('Rename file:', img.name);
                  if (newName) handleRename(img.name, newName);
                }}
                className="bg-[#0EC9DB] text-black p-1 rounded hover:brightness-110"
                title="Rename"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(img.name)}
                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                title="Delete"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
