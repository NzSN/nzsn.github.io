import fs from "fs";
import path from "path";
import { Layout } from "./components/Layout";
import { DocsList } from "./components/DocsList";

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
    <Layout documents={docs} isHomePage>
      <section className="nextra-hero">
        <h1 className="nextra-hero-title">Documentation Library</h1>
        <p className="nextra-hero-subtitle">
          Browse and search through {docs.length} documents exported from Org Mode
        </p>
        
        <div className="nextra-hero-stats">
          <div className="nextra-stat">
            <span className="nextra-stat-value">{docs.length}</span>
            <span className="nextra-stat-label">Documents</span>
          </div>
        </div>
      </section>

      <DocsList documents={docs} />
    </Layout>
  );
}