'use client'
import { useEffect } from "react";
import "./globals.css";
import { initSession } from "@/lib/auth/initSession";


export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    initSession()
  }, [])

  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
