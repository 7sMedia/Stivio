// /app/layout.tsx

import "../styles/globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen h-full dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Beta7</title>
        <meta name="description" content="Beta7 AI Video Generator from Images" />
        <link rel="icon" href="/favicon.ico" />
        <Script
          src="https://www.dropbox.com/static/api/2/dropins.js"
          id="dropboxjs"
          data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen h-full antialiased bg-black text-white">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
