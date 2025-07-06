"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "error";
};

type ToastContextType = {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(({ id, title, description, variant }) => (
          <div
            key={id}
            className={`rounded-lg border p-4 w-64 text-sm shadow-lg
              ${variant === "error" ? "bg-red-800/50 text-red-200 border-red-600"
               : variant === "success" ? "bg-green-800/50 text-green-200 border-green-600"
               : "bg-zinc-800 text-white border-zinc-700"}`}
          >
            <p className="font-semibold">{title}</p>
            {description && <p className="text-xs mt-1">{description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
