// app/layout.tsx
import './styles/globals.css'; // Adjust if your styles import path is different
import { ReactNode } from "react";
import Script from "next/script";
import ResponsiveContainer from "./components/ui/ResponsiveContainer";

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
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </body>
    </html>
  );
}
