import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORG DOCS SHOW",
  description: "Documentation viewer for HTML docs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
