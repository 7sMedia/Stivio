import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen h-full">
      <body className="min-h-screen h-full bg-gradient-to-br from-indigo-900 via-violet-900 to-black antialiased">
        {children}
      </body>
    </html>
  );
}
