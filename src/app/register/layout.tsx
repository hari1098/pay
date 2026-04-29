import type React from "react";
import Navbar from "@/components/navbar";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-65px)] bg-muted/30 py-10 px-2 w-full">
        {children}
      </main>
    </>
  );
}
