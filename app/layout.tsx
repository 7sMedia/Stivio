import "../styles/globals.css";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/use-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased overflow-x-hidden dark">
      <head>
        <title>Beta7</title>
        <meta name="description" content="AI video creation from still images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
