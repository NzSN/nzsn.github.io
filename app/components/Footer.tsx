import Link from "next/link";

interface FooterProps {
  prevDoc?: { name: string; path: string } | null;
  nextDoc?: { name: string; path: string } | null;
}

export function Footer({ prevDoc, nextDoc }: FooterProps) {
  return (
    <footer className="nextra-footer">
      <div className="nextra-footer-inner">
        <div className="nextra-footer-links">
          <a
            href="https://github.com/nzsn/nzsn.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="nextra-footer-link"
          >
            GitHub
          </a>
          <Link href="/" className="nextra-footer-link">
            Home
          </Link>
        </div>
        <div className="nextra-footer-copyright">
          © {new Date().getFullYear()} Docs Library
        </div>
      </div>

      {(prevDoc || nextDoc) && (
        <div className="nextra-nav-footer" style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
          {prevDoc ? (
            <Link href={`/docs/${prevDoc.path}`} className="nextra-nav-link-card prev">
              <span>←</span>
              <div>
                <div className="nextra-nav-link-label">Previous</div>
                <div className="nextra-nav-link-title">{formatTitle(prevDoc.name)}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextDoc ? (
            <Link href={`/docs/${nextDoc.path}`} className="nextra-nav-link-card">
              <div>
                <div className="nextra-nav-link-label">Next</div>
                <div className="nextra-nav-link-title">{formatTitle(nextDoc.name)}</div>
              </div>
              <span>→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </footer>
  );
}

function formatTitle(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
