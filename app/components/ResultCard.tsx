"use client";

import type { ApiSearchResultItem } from "@/app/lib/types";

export interface ResultCardProps {
  result: ApiSearchResultItem;
  /** 1-based rank for display. */
  rank?: number;
  /** True when this card is one of the top 5 used as context for the summary. */
  isContextOfSummary?: boolean;
}

/** Similarity 0–1 → percentage string. */
function similarityPercent(similarity: number | undefined): string {
  const p = Math.round((similarity ?? 0) * 100);
  return `${p}%`;
}

export function ResultCard({ result, rank, isContextOfSummary }: ResultCardProps) {
  const similarityPct = similarityPercent(result.similarity);

  const baseCardClass =
    "group block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-zinc-800/50";
  const contextCardClass =
    "border-emerald-300 bg-emerald-50/80 hover:border-emerald-400 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:hover:border-emerald-600/60";
  const normalCardClass =
    "border-zinc-200 hover:border-emerald-200 dark:border-zinc-700 dark:hover:border-emerald-800/60";
  const cardClass = `${baseCardClass} ${isContextOfSummary ? contextCardClass : normalCardClass}`;

  const content = (
    <>
      <div className="flex items-start gap-3">
        {rank != null && (
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold
              ${isContextOfSummary ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/60 dark:text-emerald-200" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"}`}
            aria-hidden
          >
            {rank}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-medium text-emerald-700 transition group-hover:text-emerald-600 dark:text-emerald-400 dark:group-hover:text-emerald-300">
              {result.Article_title_tr ? result.Article_title_tr : result.Article_title}
            </h3>
            <span
              className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              title="شباهت به جستجو"
            >
              شباهت {similarityPct}
            </span>
          </div>
          {isContextOfSummary && (
            <span className="mt-1 inline-block rounded bg-emerald-200/80 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-200">
              متن خلاصه
            </span>
          )}
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            صفحه {result.page_number}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {result.preview}
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
    <a href={`https://${result.Article_url}`} className={cardClass}>
      {content}
    </a>
  );
}
