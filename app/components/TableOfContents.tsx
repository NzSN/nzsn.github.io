"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    headings.forEach((heading) => {
      if (heading) observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        if (heading) observer.unobserve(heading);
      });
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="nextra-toc">
      <div className="nextra-toc-title">On This Page</div>
      <ul className="nextra-toc-list">
        {items.map((item) => (
          <li key={item.id} className="nextra-toc-item">
            <a
              href={`#${item.id}`}
              className={`nextra-toc-link ${activeId === item.id ? "active" : ""}`}
              data-level={item.level}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}