import type { SearchResponse, SearchResult, AISummary } from "./types";

/** Mock result pool - in production replace with real API. */
const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "Next.js – The React Framework for Production",
    url: "https://nextjs.org",
    snippet: "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.",
    displayUrl: "nextjs.org",
  },
  {
    id: "2",
    title: "React – A JavaScript library for building user interfaces",
    url: "https://react.dev",
    snippet: "React is a JavaScript library for building user interfaces. Learn what React is all about from our overview or walk through the tutorial.",
    displayUrl: "react.dev",
  },
  {
    id: "3",
    title: "TypeScript: JavaScript With Syntax For Types",
    url: "https://www.typescriptlang.org",
    snippet: "TypeScript extends JavaScript by adding types. By understanding JavaScript, TypeScript saves you time catching errors and providing fixes before you run code.",
    displayUrl: "typescriptlang.org",
  },
  {
    id: "4",
    title: "Tailwind CSS – Utility-First CSS Framework",
    url: "https://tailwindcss.com",
    snippet: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It works with any JS framework.",
    displayUrl: "tailwindcss.com",
  },
  {
    id: "5",
    title: "Vercel – Develop. Preview. Ship.",
    url: "https://vercel.com",
    snippet: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    displayUrl: "vercel.com",
  },
];

/**
 * Simulates AI summary from query and result titles.
 * In production, call your AI API with query + result snippets.
 */
function generateAISummary(query: string, resultTitles: string[]): AISummary {
  const topics = resultTitles.slice(0, 3).join(", ");
  const summary = `Based on your search "${query}", these results cover: ${topics}. The top links are reliable sources you can use to learn more or get started.`;
  return {
    query,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Performs search and returns AI summary + top 5 results.
 * Replace this with your real search + AI API.
 */
export async function search(query: string): Promise<SearchResponse> {
  const normalized = query.trim().toLowerCase();
  const filtered =
    normalized.length === 0
      ? MOCK_RESULTS
      : MOCK_RESULTS.filter(
          (r) =>
            r.title.toLowerCase().includes(normalized) ||
            r.snippet.toLowerCase().includes(normalized)
        );
  const results = (filtered.length > 0 ? filtered : MOCK_RESULTS).slice(0, 5);
  const summary = generateAISummary(
    query || "general web development",
    results.map((r) => r.title)
  );
  return { summary, results };
}
