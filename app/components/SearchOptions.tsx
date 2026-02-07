"use client";

import { useMemo, useState, useEffect } from "react";
import type { SearchOptions as SearchOptionsType } from "@/app/lib/types";

export interface SearchOptionsProps {
  topK: number;
  temperature: number;
  onChange: (options: SearchOptionsType) => void;
  /** Frontend-only: minimum similarity (0–1). Results below this are hidden. */
  minSimilarity?: number;
  onMinSimilarityChange?: (value: number) => void;
  compact?: boolean;
  disabled?: boolean;
}

const TOP_K_CHOICES = [5, 10, 20, 50] as const;

const MIN_SIMILARITY_PERCENT = 0;
const MAX_SIMILARITY_PERCENT = 100;
const SIMILARITY_STEP = 1;

export function SearchOptions({
  topK,
  temperature,
  onChange,
  minSimilarity = 0,
  onMinSimilarityChange,
  compact = false,
  disabled = false,
}: SearchOptionsProps) {
  const setTopK = (k: number) => onChange({ top_k: k, temperature });
  const setTemperature = (t: number) => onChange({ top_k: topK, temperature: t });
  const minSimilarityPercent = Math.round((minSimilarity ?? 0) * 100);

  // Local input value for typing (so "45" can be entered without jumping)
  const [similarityInput, setSimilarityInput] = useState(String(minSimilarityPercent));
  useEffect(() => {
    setSimilarityInput(String(minSimilarityPercent));
  }, [minSimilarityPercent]);

  const clampPercent = (n: number) =>
    Math.min(MAX_SIMILARITY_PERCENT, Math.max(MIN_SIMILARITY_PERCENT, Math.round(n)));
  const applySimilarityPercent = (p: number) => {
    const clamped = clampPercent(p);
    onMinSimilarityChange?.(clamped / 100);
    setSimilarityInput(String(clamped));
  };
  const handleSimilarityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setSimilarityInput(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) applySimilarityPercent(n);
  };
  const handleSimilarityBlur = () => {
    const n = parseInt(similarityInput, 10);
    if (Number.isNaN(n)) {
      setSimilarityInput(String(minSimilarityPercent));
      return;
    }
    applySimilarityPercent(n);
  };
  const decrementSimilarity = () => applySimilarityPercent(minSimilarityPercent - SIMILARITY_STEP);
  const incrementSimilarity = () => applySimilarityPercent(minSimilarityPercent + SIMILARITY_STEP);

  const trackStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, rgb(5 150 105) 0%, rgb(5 150 105) ${temperature * 100}%, rgb(212 212 216) ${temperature * 100}%, rgb(212 212 216) 100%)`,
    }),
    [temperature]
  );

  return (
    <div
      className={`w-full rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-4 dark:border-zinc-700/80 dark:bg-zinc-800/40
        sm:flex sm:flex-wrap sm:items-center sm:gap-4 sm:px-4 sm:py-3
        ${compact ? "sm:gap-3 sm:px-3 sm:py-2" : ""}`}
      role="group"
      aria-label="تنظیمات جستجو"
    >
      {/* تعداد نتایج - stacks on mobile, inline on sm+ */}
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
        <span
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          aria-hidden
        >
          تعداد نتایج
        </span>
        <div className="flex flex-wrap gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-700/60 sm:flex-nowrap sm:p-0.5">
          {TOP_K_CHOICES.map((k) => (
            <button
              key={k}
              type="button"
              disabled={disabled}
              onClick={() => setTopK(k)}
              aria-pressed={topK === k}
              aria-label={`${k} نتیجه`}
              className={`min-h-[32px] min-w-[44px] flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition touch-manipulation
                sm:min-h-0 sm:min-w-0 sm:flex-none sm:rounded-md sm:px-3 sm:py-1.5
                ${topK === k
                  ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                  : "text-zinc-600 hover:bg-zinc-200/80 active:bg-zinc-300/80 dark:text-zinc-300 dark:hover:bg-zinc-600/80 dark:active:bg-zinc-500/80"
                }
                ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* خلاقیت - value on hover only; slider forced LTR so fill and thumb match */}
      <div className="flex w-full pt-5 sm:pt-0 flex-col gap-2 sm:min-w-[200px] sm:flex-1 sm:flex-row sm:items-center sm:gap-3 md:min-w-[240px]">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:shrink-0">
          خلاقیت
        </span>
        {/* dir="ltr" keeps 0=left, 1=right so fill and thumb align (fixes RTL bug) */}
        <div className="group relative w-full" dir="ltr">
          {/* Value bubble - visible only on hover/focus */}
          <span
            className="pointer-events-none absolute bottom-full left-0 flex -translate-x-1/2 flex-col items-center pb-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{ left: `${temperature * 100}%` }}
          >
            <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-2 ring-emerald-400/30 dark:bg-emerald-500 dark:ring-emerald-300/20">
              {temperature.toFixed(1)}
            </span>
            <span className="absolute top-full h-0 w-0 border-[6px] border-transparent border-t-emerald-600 dark:border-t-emerald-500" aria-hidden />
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            disabled={disabled}
            onChange={(e) => setTemperature(Number(e.target.value))}
            aria-label="سطح خلاقیت مدل از واقع‌گرا تا خلاق"
            className="h-3 w-full cursor-pointer touch-manipulation appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-60
              [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:transition
              [&::-webkit-slider-thumb]:active:scale-110 dark:[&::-webkit-slider-thumb]:ring-zinc-800
              sm:[&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:w-4"
            style={trackStyle}
          />
          {/* <div className="mt-1.5 flex justify-between px-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            <span>واقع‌گرا</span>
            <span>خلاق</span>
          </div> */}
        </div>
      </div>

      {/* حداقل شباهت - number input + increment/decrement buttons; full width on phone, touch-friendly */}
      {onMinSimilarityChange != null && (
        <div className="flex w-full flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700 sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:border-t-0  sm:pt-0">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:shrink-0">
            حداقل شباهت
          </span>
          <div className="flex w-full min-w-0 max-w-[200px] sm:max-w-none items-center gap-0 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-600 dark:bg-zinc-800/60">
            <button
              type="button"
              disabled={disabled || minSimilarityPercent <= MIN_SIMILARITY_PERCENT}
              onClick={decrementSimilarity}
              aria-label="کاهش حداقل شباهت"
              className="flex h-10 min-h-[44px] w-11 shrink-0 touch-manipulation items-center justify-center rounded-e-xl border-s border-zinc-200 text-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-transparent dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700 sm:h-9 sm:min-h-0 sm:w-9"
            >
              −
            </button>
            <label className="border-x border-zinc-200 item-center flex w-full  items-center justify-center  px-4" dir="ltr">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-1">%</span>
              <input
                type="number"
                min={MIN_SIMILARITY_PERCENT}
                max={MAX_SIMILARITY_PERCENT}
                step={SIMILARITY_STEP}
                value={similarityInput}
                onChange={handleSimilarityInputChange}
                onBlur={handleSimilarityBlur}
                disabled={disabled}
                aria-label="حداقل شباهت (درصد)"
                className="h-9  w-6 border-0 bg-transparent  text-sm tabular-nums outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:bg-transparent"
              />
            </label>
            <button
              type="button"
              disabled={disabled || minSimilarityPercent >= MAX_SIMILARITY_PERCENT}
              onClick={incrementSimilarity}
              aria-label="افزایش حداقل شباهت"
              className="flex h-10 min-h-[44px] w-11 shrink-0 touch-manipulation items-center justify-center rounded-s-xl border-e border-zinc-200 text-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-transparent dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700 sm:h-9 sm:min-h-0 sm:w-9"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
