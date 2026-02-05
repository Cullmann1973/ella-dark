import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project BELLA | Batch & Equipment Line-Level Assistant",
  description: "Real-time manufacturing intelligence dashboard for production line monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] text-[#e5e5eb] antialiased`}>
        {children}
      </body>
    </html>
  );
}
