// components/ui/toast-provider.tsx

"use client";

import * as React from "react";
import { Toaster } from "sonner"; // Assumes "sonner" is now in your package.json

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
