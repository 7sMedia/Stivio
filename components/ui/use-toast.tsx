"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

let listeners: React.Dispatch<React.SetStateAction<ToastOptions[]>>[] = [];

export function useToast() {
  const toast = (opts: ToastOptions) => {
    listeners.forEach((setQueue) =>
      setQueue((prev) => [...prev, { ...opts }])
    );
  };

  return { toast };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([]);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {toasts.map((toast, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl px-4 py-3 shadow-lg transition-all duration-300 text-sm",
              toast.variant === "error"
                ? "bg-red-500 text-white"
                : toast.variant === "success"
                ? "bg-green-500 text-white"
                : "bg-zinc-900 text-white"
            )}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm opacity-90 mt-1">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
