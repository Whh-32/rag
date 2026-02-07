"use client";

import { useMemo } from "react";
import type { AISummary, ApiSearchResultItem } from "@/app/lib/types";
import { AISummary as AISummaryComponent } from "./AISummary";
import { ResultCard } from "./ResultCard";

export interface SearchResultsProps {
  summary: AISummary;
  results: ApiSearchResultItem[];
  /** Minimum similarity (0–1). Only results with similarity >= this are shown. Frontend filter only. */
  minSimilarity?: number;
}

export function SearchResults({ summary, results, minSimilarity = 0 }: SearchResultsProps) {
  const filtered = useMemo(() => {
    const threshold = minSimilarity ?? 0;
    return results.filter((r) => (r.similarity ?? 0) >= threshold);
  }, [results, minSimilarity]);

  return (
    <section className="flex w-full max-w-3xl flex-col gap-6" aria-label="نتایج جستجو">
      <AISummaryComponent data={summary} />
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            برترین {filtered.length} نتیجه
            {minSimilarity > 0 && (
              <span className="mr-2 text-zinc-400 dark:text-zinc-500">
                (حداقل شباهت {Math.round(minSimilarity * 100)}٪)
              </span>
            )}
          </h2>
          <ul className="flex flex-col gap-3" role="list">
            {filtered.map((result, index) => (
              <li key={result.page_id}>
                <ResultCard
                  result={result}
                  rank={result.rank ?? index + 1}
                  isContextOfSummary={(result.rank ?? index + 1) <= 5}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {results.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          هیچ نتیجه‌ای با حداقل شباهت {Math.round((minSimilarity ?? 0) * 100)}٪ یافت نشد. حداقل شباهت را کم کنید.
        </p>
      )}
    </section>
  );
}
