import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Layout } from "../../components/Layout";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getDocFiles(): Promise<{ name: string; path: string }[]> {
  const docsDir = path.join(process.cwd(), "Docs");

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  return fs
    .readdirSync(docsDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({
      name: file.replace(".html", ""),
      path: file.replace(".html", ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getDocContent(docPath: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), "Docs", `${docPath}.html`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return fs.readFileSync(fullPath, "utf-8");
}

function rewriteHtmlLinks(content: string): string {
  let result = content;
  
  result = result.replace(/<\?xml[^>]*\?>/gi, "");
  result = result.replace(/<!DOCTYPE[^>]*>/gi, "");
  
  result = result.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, "");
  result = result.replace(/<link[^>]*href=["']\.\/style\.css["'][^>]*>/gi, "");
  result = result.replace(/<script[^>]*src=["']\.\/[^"']+\.js["'][^>]*><\/script>/gi, "");
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  
  result = result.replace(/<a[^>]*class=["']doc-home-btn["'][^>]*>.*?<\/a>/gi, "");
  
  result = result.replace(/<div[^>]*id=["']content["'][^>]*>/gi, "<div>");
  result = result.replace(/<div[^>]*id=["']postamble["'][^>]*>/gi, "<div>");
  result = result.replace(/<div[^>]*id=["']table-of-contents["'][^>]*>/gi, "<div>");
  result = result.replace(/<div[^>]*id=["']outline-container-[^"']*["'][^>]*>/gi, "<div>");
  result = result.replace(/<div[^>]*class=["'][^"']*outline-[^"']*["'][^>]*>/gi, "<div>");
  
  result = result.replace(
    /(href|src)=["'](\.\/)?([^"']+\.html)(#[^"']*)?["']/g,
    (_match, attr, _slash, file, hash) => {
      const baseName = file.replace(/\.html$/, "");
      if (hash) {
        return `${attr}="/docs/${baseName}${hash}"`;
      }
      return `${attr}="/docs/${baseName}"`;
    }
  );
  
  result = result.replace(/<html[^>]*>/gi, "");
  result = result.replace(/<\/html>/gi, "");
  result = result.replace(/<head[^>]*>.*?<\/head>/gis, "");
  result = result.replace(/<body[^>]*>/gi, "");
  result = result.replace(/<\/body>/gi, "");
  
  return result;
}

function extractTocItems(content: string): { id: string; text: string; level: number }[] {
  const tocItems: { id: string; text: string; level: number }[] = [];
  const headingRegex = /<h([1-4])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    
    if (text && level >= 2) {
      tocItems.push({ id, text, level });
    }
  }
  
  return tocItems;
}

function formatTitle(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  const files = await getDocFiles();
  return files.map((file) => ({
    slug: [file.path],
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const docPath = slug.join("/");
  const rawContent = await getDocContent(docPath);

  if (!rawContent) {
    notFound();
  }

  const content = rewriteHtmlLinks(rawContent);

  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : formatTitle(docPath);

  const tocItems = extractTocItems(content);

  const allDocs = await getDocFiles();
  const currentIndex = allDocs.findIndex((d) => d.path === docPath);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <Layout
      documents={allDocs}
      currentPath={docPath}
      tocItems={tocItems}
      prevDoc={prevDoc}
      nextDoc={nextDoc}
    >
      <main className="nextra-content">
        <article className="nextra-prose">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </main>
    </Layout>
  );
}