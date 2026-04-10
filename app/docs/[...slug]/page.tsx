import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getDocFiles(): Promise<string[]> {
  const docsDir = path.join(process.cwd(), "Docs");

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  return fs
    .readdirSync(docsDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => `/Docs/${file}`);
}

async function getDocContent(docPath: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), docPath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return fs.readFileSync(fullPath, "utf-8");
}

function rewriteHtmlLinks(content: string, docName: string): string {
  let result = content;
  result = result.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, "");
  result = result.replace(/<link[^>]*href=["']\.\/style\.css["'][^>]*>/gi, "");
  result = result.replace(/<script[^>]*src=["']\.\/[^"']+\.js["'][^>]*><\/script>/gi, "");
  result = result.replace(
    /(href|src)=["'](\.\/)?([^"']+\.html)(#[^"']*)?["']/g,
    (match, attr, slash, file, hash) => {
      const baseName = file.replace(/\.html$/, "");
      if (hash) {
        return `${attr}="/docs/${baseName}${hash}"`;
      }
      return `${attr}="/docs/${baseName}"`;
    }
  );
  return result;
}

export async function generateStaticParams() {
  const files = await getDocFiles();
  return files.map((file) => ({
    slug: file.replace(/^\/Docs\//, "").replace(/\.html$/, "").split("/"),
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const docPath = slug.join("/");
  const fullPath = `/Docs/${docPath}.html`;
  const rawContent = await getDocContent(fullPath);

  if (!rawContent) {
    notFound();
  }

  const content = rewriteHtmlLinks(rawContent, docPath);

  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : docPath;

  const allDocs = await getDocFiles();
  const currentIndex = allDocs.findIndex(
    (d) => d === fullPath || d === fullPath.replace(/\/$/, "")
  );
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            ← Back to Index
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full p-8">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <footer className="p-4 border-t">
        <div className="max-w-6xl mx-auto flex justify-between">
          {prevDoc ? (
            <Link
              href={`/docs/${prevDoc.replace("/Docs/", "").replace(".html", "")}`}
              className="text-blue-600 hover:underline"
            >
              ← {prevDoc.replace("/Docs/", "").replace(".html", "")}
            </Link>
          ) : (
            <span />
          )}
          {nextDoc ? (
            <Link
              href={`/docs/${nextDoc.replace("/Docs/", "").replace(".html", "")}`}
              className="text-blue-600 hover:underline"
            >
              {nextDoc.replace("/Docs/", "").replace(".html", "")} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </footer>
    </div>
  );
}
