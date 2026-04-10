"use client";

import { useState } from "react";

interface SearchInputProps {
  documents: { name: string; path: string }[];
  onFilter: (filtered: { name: string; path: string }[]) => void;
}

export function SearchInput({ documents, onFilter }: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      onFilter(documents);
      return;
    }

    const lowerQuery = value.toLowerCase();
    const filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(lowerQuery)
    );
    onFilter(filtered);
  };

  return (
    <div className="nextra-search-wrapper">
      <span className="nextra-search-large-icon">⌕</span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search documents..."
        className="nextra-search-large"
        aria-label="Search documents"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onFilter(documents);
          }}
          className="nextra-search-clear"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
