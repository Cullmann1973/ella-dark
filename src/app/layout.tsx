import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-[#080c14] text-[#e0e6f0] antialiased">
        {children}
      </body>
    </html>
  );
}
