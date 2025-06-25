import '../styles/globals.css';
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="min-h-screen h-full"
      style={{
        minHeight: '100vh',
        height: '100%',
        WebkitMinHeight: '-webkit-fill-available',
      }}
    >
      <body
        className="min-h-screen h-full antialiased"
        style={{
          minHeight: '100vh',
          height: '100%',
          WebkitMinHeight: '-webkit-fill-available',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </body>
    </html>
  );
}
