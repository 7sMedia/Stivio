import '../styles/globals.css';
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen h-full">
      <body className="min-h-screen h-full antialiased">
        {children}
      </body>
    </html>
  );
}
