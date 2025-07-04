// /app/layout.tsx
import '../styles/globals.css';
import { ReactNode } from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen h-full">
      <head>
        <Script
          src="https://www.dropbox.com/static/api/2/dropins.js"
          id="dropboxjs"
          data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen h-full antialiased">
        {children}
      </body>
    </html>
  );
}
