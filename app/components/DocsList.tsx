"use client";

import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { DocCard } from "./DocCard";

interface DocFile {
  name: string;
  path: string;
}

interface DocsListProps {
  documents: DocFile[];
}

export function DocsList({ documents }: DocsListProps) {
  const [filteredDocs, setFilteredDocs] = useState<DocFile[]>(documents);

  return (
    <>
      <div className="nextra-search-container">
        <SearchInput documents={documents} onFilter={setFilteredDocs} />
      </div>

      {filteredDocs.length > 0 ? (
        <div className="nextra-doc-grid">
          {filteredDocs.map((doc, index) => (
            <DocCard key={doc.path} name={doc.name} path={doc.path} index={index} />
          ))}
        </div>
      ) : (
        <div className="nextra-empty">
          <div className="nextra-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="nextra-empty-title">No documents found</h3>
          <p className="nextra-empty-text">Try adjusting your search query</p>
        </div>
      )}
    </>
  );
}