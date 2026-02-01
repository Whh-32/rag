"use client";

import type { SearchResult } from "@/app/lib/types";

export interface ResultCardProps {
  result: SearchResult;
  /** 1-based rank for display. */
  rank?: number;
}

export function ResultCard({ result, rank }: ResultCardProps) {
  const displayUrl = result.displayUrl ?? (result.url.startsWith("http") ? new URL(result.url).hostname : result.url);
  const cardClass = "group block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-emerald-800/60";

  const content = (
    <>
      <div className="flex items-start gap-3">
        {rank != null && (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
            aria-hidden
          >
            {rank}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-emerald-700 transition group-hover:text-emerald-600 dark:text-emerald-400 dark:group-hover:text-emerald-300">
            {result.title}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{displayUrl}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {result.snippet}
          </p>
        </div>
        <span className="shrink-0 text-zinc-400 transition group-hover:text-emerald-500 dark:text-zinc-500" aria-hidden>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>
    </>
  );

  return (
    <a href={result.url} target={result.url.startsWith("http") ? "_blank" : undefined} rel={result.url.startsWith("http") ? "noopener noreferrer" : undefined} className={cardClass}>
      {content}
    </a>
  );
}
