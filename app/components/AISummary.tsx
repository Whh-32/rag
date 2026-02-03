"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { AISummary as AISummaryType } from "@/app/lib/types";

const CHAR_DELAY_MS = 35;

export interface AISummaryProps {
  data: AISummaryType;
}

export function AISummary({ data }: AISummaryProps) {
  const target = data.summary;
  const [displayedLength, setDisplayedLength] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (target.length < displayedLength) setDisplayedLength(target.length);
  }, [target, displayedLength]);

  useEffect(() => {
    if (displayedLength >= target.length) return;
    const intervalId = setInterval(() => {
      setDisplayedLength((prev) => {
        const len = targetRef.current.length;
        const next = Math.min(prev + 1, len);
        if (next >= len) clearInterval(intervalId);
        return next;
      });
    }, CHAR_DELAY_MS);
    return () => clearInterval(intervalId);
  }, [target, displayedLength]);

  const displayedText = target.slice(0, displayedLength);
  const markdownText = displayedText.replace(/\\n/g, "\n");

  return (
    <article
      className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 to-teal-50/70 p-5 shadow-sm dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/30"
      aria-label="خلاصه هوشمند نتایج جستجو"
      dir="rtl"
    >
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 dark:bg-emerald-500/30" aria-hidden>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </span>
        <span className="text-sm font-semibold uppercase tracking-wide">خلاصه هوشمند</span>
      </div>
      <div className="mt-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ms-4">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-zinc-900 dark:text-zinc-100">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-700">{children}</code>
            ),
            ul: ({ children }) => <ul className="my-2 list-disc ps-6">{children}</ul>,
            ol: ({ children }) => <ol className="my-2 list-decimal ps-6">{children}</ol>,
            li: ({ children }) => <li className="my-0.5">{children}</li>,
            a: ({ href, children }) => (
              <a href={href} className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            h1: ({ children }) => <h1 className="mb-2 mt-3 text-lg font-bold">{children}</h1>,
            h2: ({ children }) => <h2 className="mb-2 mt-2 text-base font-bold">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-bold">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-s-4 border-zinc-300 ps-3 dark:border-zinc-600">{children}</blockquote>
            ),
          }}
        >
          {markdownText}
        </ReactMarkdown>
      </div>
    </article>
  );
}
