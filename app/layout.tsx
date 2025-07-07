// app/layout.tsx

import "../styles/globals.css";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/use-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased overflow-x-hidden dark">
      <body className="min-h-screen overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
