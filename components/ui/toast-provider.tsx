// components/ui/toast-provider.tsx

"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
