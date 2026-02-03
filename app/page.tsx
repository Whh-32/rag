"use client";

import { useState, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { searchStream } from "@/app/lib/searchStream";
import type { SearchResult, AISummary, SearchOptions } from "@/app/lib/types";
import { SearchBar } from "@/app/components/SearchBar";
import { SearchOptions as SearchOptionsComponent } from "@/app/components/SearchOptions";
import { SearchResults } from "@/app/components/SearchResults";

const DEFAULT_TOP_K = 5;
const DEFAULT_TEMPERATURE = 0.1;

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summaryText, setSummaryText] = useState("");
  const [isStreamingSummary, setIsStreamingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topK, setTopK] = useState(DEFAULT_TOP_K);
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const summaryStartedAt = useRef<string | null>(null);

  const hasSearched = results.length > 0 || summaryText.length > 0 || isLoading;

  const handleOptionsChange = useCallback((options: SearchOptions) => {
    if (options.top_k != null) setTopK(options.top_k);
    if (options.temperature != null) setTemperature(options.temperature);
  }, []);

  const handleSearch = useCallback(
    async (q: string) => {
      setQuery(q);
      setError(null);
      setResults([]);
      setSummaryText("");
      setIsStreamingSummary(false);
      summaryStartedAt.current = null;
      setIsLoading(true);

      try {
        await searchStream(
          q,
          {
            onResults: (items) => setResults(items),
            onToken: (content) => {
              flushSync(() => {
                if (!summaryStartedAt.current) {
                  summaryStartedAt.current = new Date().toISOString();
                  setIsStreamingSummary(true);
                }
                setSummaryText((prev) => prev + content);
              });
            },
            onDone: () => setIsStreamingSummary(false),
            onError: (err) => {
              setError(err.message);
              setIsStreamingSummary(false);
            },
          },
          { top_k: topK, temperature }
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "جستجو ناموفق بود");
      } finally {
        setIsLoading(false);
      }
    },
    [topK, temperature]
  );

  const summary: AISummary = {
    query,
    summary: summaryText,
    generatedAt: summaryStartedAt.current ?? new Date().toISOString(),
    isStreaming: isStreamingSummary,
  };

  const response = results.length > 0 || summaryText.length > 0
    ? { summary, results }
    : null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <header
        className={`border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 transition-all duration-500 ease-out ${hasSearched
          ? "py-4"
          : "absolute inset-x-0 top-0 flex min-h-screen flex-col items-center justify-center py-8"
          }`}
      >
        <div
          className={`mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 transition-all duration-500 ease-out ${hasSearched ? "items-stretch" : "items-center gap-10"
            }`}
        >
          {/* {hasSearched && query && (
            <p
              className="animate-fade-slide text-end text-lg font-bold text-zinc-900 dark:text-zinc-100"
              aria-live="polite"
            >
              {query}
            </p>
          )} */}

          <h1 className="text-center animate-fade-in text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            جستجو
          </h1>

          <div className={"w-full"}>
            <SearchBar
              value={query}
              onSearch={handleSearch}
              isLoading={isLoading}
              placeholder="جستجو..."
              compact={hasSearched}
            />
          </div>
          <SearchOptionsComponent
            topK={topK}
            temperature={temperature}
            onChange={handleOptionsChange}
            compact={hasSearched}
            disabled={isLoading}
          />
        </div>
      </header>

      {hasSearched && (
        <main className="animate-fade-in mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
          {error && (
            <div
              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}
          {response && (
            <SearchResults
              summary={response.summary}
              results={response.results}
            />
          )}
          {!response && !error && isLoading && (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              در حال جستجو…
            </p>
          )}
        </main>
      )}
    </div>
  );
}
