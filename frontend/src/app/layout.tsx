import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import RootProviders from "./root_provider";
import 'react-medium-image-zoom/dist/styles.css'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PaisaAds - Advertisement Platform",
  description: "Find and post advertisements across multiple categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
