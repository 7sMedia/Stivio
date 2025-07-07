import "../styles/globals.css";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/use-toast";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased overflow-x-hidden dark">
      <head>
        <title>Beta7</title>
        <meta name="description" content="AI video creation from still images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        {/* Dropbox Chooser SDK */}
        <Script
          id="dropbox-chooser"
          src="https://www.dropbox.com/static/api/2/dropins.js"
          data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
          strategy="beforeInteractive"
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
