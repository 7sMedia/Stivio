// /app/layout.tsx
import "../styles/globals.css";
import { ReactNode } from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Beta7 SaaS</title>
        {/* You can add more meta tags or favicon here */}
      </head>
      <body className="min-h-screen h-full antialiased">
        {/* Dropbox JS SDK - loads before interactive React */}
        <Script
          src="https://www.dropbox.com/static/api/2/dropins.js"
          id="dropboxjs"
          data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
