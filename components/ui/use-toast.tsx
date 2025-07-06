"use client";

import * as React from "react";

type ToastOptions = {
  title: string;
  description?: string;
};

const toastListeners: ((opts: ToastOptions) => void)[] = [];

export function useToast() {
  const toast = (opts: ToastOptions) => {
    toastListeners.forEach((listener) => listener(opts));
  };

  return { toast };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastOptions | null>(null);

  React.useEffect(() => {
    const listener = (opts: ToastOptions) => {
      setToast(opts);
      setTimeout(() => setToast(null), 2500);
    };
    toastListeners.push(listener);
    return () => {
      const i = toastListeners.indexOf(listener);
      if (i >= 0) toastListeners.splice(i, 1);
    };
  }, []);

  return (
    <>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs w-full bg-zinc-900 text-white rounded-xl shadow-lg px-4 py-3 animate-in slide-in-from-bottom fade-in transition-all duration-300">
          <div className="font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="text-sm text-zinc-400 mt-1">{toast.description}</div>
          )}
        </div>
      )}
    </>
  );
}
