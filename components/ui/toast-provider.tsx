// components/ui/toast-provider.tsx

"use client";

import * as React from "react";
import { Toaster } from "sonner"; // If not yet installed, replace with any fallback

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
