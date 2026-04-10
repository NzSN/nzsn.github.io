"use client";

import { Header } from "./Header";
import { TableOfContents } from "./TableOfContents";
import { Footer } from "./Footer";

interface DocItem {
  name: string;
  path: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface LayoutProps {
  documents: DocItem[];
  currentPath?: string;
  tocItems?: TocItem[];
  prevDoc?: { name: string; path: string } | null;
  nextDoc?: { name: string; path: string } | null;
  children: React.ReactNode;
  isHomePage?: boolean;
}

export function Layout({
  documents,
  currentPath,
  tocItems = [],
  prevDoc,
  nextDoc,
  children,
  isHomePage = false,
}: LayoutProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}

      <div className="nextra-content-container">
        {children}
      </div>

      {!isHomePage && <Footer prevDoc={prevDoc} nextDoc={nextDoc} />}
    </div>
  );
}
