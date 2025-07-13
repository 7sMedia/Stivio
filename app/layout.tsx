import "@/styles/globals.css";  // ✅ Corrected path

import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piksion – Image In. Motion Out.",
  description: "Generate AI-powered videos from images. Auto-post to social. Powered by Piksion.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Piksion",
    description: "Generate AI-powered videos from images. Auto-post to social. Powered by Piksion.",
    images: ["/piksion-logo-512.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
