"use client";

import {
  ToastProvider,
  ToastViewport,
  Toast as RadixToast,
  ToastTitle,
  ToastDescription,
} from "@radix-ui/react-toast";
import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <RadixToast key={id} {...props}>
          <Toast
            title={title}
            description={description}
            action={action}
            variant={props.variant}
          />
        </RadixToast>
      ))}

      <ToastViewport className="fixed bottom-4 right-4 z-50 outline-none" />
    </ToastProvider>
  );
}
