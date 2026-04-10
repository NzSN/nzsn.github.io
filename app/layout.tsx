import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docs Library",
  description: "Documentation viewer for Org Mode HTML exports",
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

const mathJaxScript = `
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  },
  startup: {
    ready: function() {
      MathJax.startup.defaultReady();
    }
  }
};
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script id="mathjax-config" type="text/javascript" dangerouslySetInnerHTML={{ __html: mathJaxScript }} />
        <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
