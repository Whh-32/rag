"use client";

import { useState, useCallback, useEffect } from "react";

export interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  /** Compact style for top bar (after first search). */
  compact?: boolean;
}

export function SearchBar({
  value,
  onSearch,
  isLoading = false,
  placeholder = "جستجو در وب…",
  compact = false,
}: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = input.trim();
      if (q) onSearch(q);
    },
    [input, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center rounded-2xl border border-zinc-200 bg-zinc-50/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:focus-within:border-emerald-400 dark:focus-within:ring-emerald-400/20 ${
          compact ? "py-2.5" : "py-3.5"
        }`}
      >
        <span
          className="pointer-events-none absolute end-4 text-zinc-400 dark:text-zinc-500"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus={!compact}
          className="w-full bg-transparent py-0 pe-12 ps-24 text-zinc-900 placeholder-zinc-500 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
          aria-label="جستجو"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute start-2 flex h-9 items-center rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "جستجو"
          )}
        </button>
      </div>
    </form>
  );
}
