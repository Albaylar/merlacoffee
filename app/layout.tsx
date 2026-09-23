import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merla Coffee",
  description: "Merla Coffee – premium specialty coffee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
