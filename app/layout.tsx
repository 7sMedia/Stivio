// app/layout.tsx
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

+       {/* Dropbox Chooser script with your public app key */}
+       <script
+         id="dropbox-chooser"
+         src="https://www.dropbox.com/static/api/2/dropins.js"
+         data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
+       />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
