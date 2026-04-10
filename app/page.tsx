import Link from "next/link";
import fs from "fs";
import path from "path";

interface DocFile {
  name: string;
  path: string;
}

async function getDocFiles(): Promise<DocFile[]> {
  const docsDir = path.join(process.cwd(), "Docs");

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  const files = fs.readdirSync(docsDir);
  return files
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({
      name: file.replace(".html", ""),
      path: file.replace(".html", ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Home() {
  const docs = await getDocFiles();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>
      <p className="text-gray-600 mb-8">Total documents: {docs.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <Link
            key={doc.path}
            href={`/docs/${doc.path}`}
            className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <span className="text-blue-600 text-sm">/docs/{doc.path}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
