"use client";

import type { AISummary, SearchResult } from "@/app/lib/types";
import { AISummary as AISummaryComponent } from "./AISummary";
import { ResultCard } from "./ResultCard";

export interface SearchResultsProps {
  summary: AISummary;
  results: SearchResult[];
}

export function SearchResults({ summary, results }: SearchResultsProps) {

  console.log(results)
  return (
    <section className="flex w-full max-w-3xl flex-col gap-6" aria-label="نتایج جستجو">
      <AISummaryComponent data={summary} />
      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            برترین {results.length} نتیجه
          </h2>
          <ul className="flex flex-col gap-3" role="list">
            {results.map((result, index) => (
              <li key={result.id}>
                <ResultCard result={result} rank={index + 1} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
