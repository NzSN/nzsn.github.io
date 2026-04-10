import Link from "next/link";

interface DocCardProps {
  name: string;
  path: string;
  index: number;
}

export function DocCard({ name, path, index }: DocCardProps) {
  return (
    <Link 
      href={`/docs/${path}`} 
      className="nextra-doc-card" 
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="nextra-doc-card-content">
        <h3 className="nextra-doc-card-title">{formatTitle(name)}</h3>
      </div>
      <span className="nextra-doc-card-arrow">→</span>
    </Link>
  );
}

function formatTitle(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
