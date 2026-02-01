import type { SearchResult, ApiSearchResultItem, ApiTokenPayload } from "./types";

/** Client calls this; use /api/search (Next route) or set NEXT_PUBLIC_SEARCH_API_URL. */
const DEFAULT_API_URL = "/";
const API_PATH = "/api/rag/stream"

/**
 * Maps API search result item to app SearchResult.
 */
function mapApiResultToSearchResult(item: ApiSearchResultItem): SearchResult {
  const snippet = item.preview.replace(/\r\n/g, " ").replace(/\s+/g, " ").trim();
  const firstLine = snippet.slice(0, 100);
  const title = firstLine.length < snippet.length ? `${firstLine}…` : firstLine;
  return {
    id: String(item.idPage),
    title: item.Article_title || `نتیجه ${item.rank}`,
    url: `#result-${item.idPage}`,
    snippet,
    displayUrl: `صفحه ${item.idPage}`,
  };
}

/**
 * Parses a single "data: {...}" line from SSE.
 */
function parseStreamLine(line: string): { type: string; data: unknown } | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const json = trimmed.slice(5).trim();
  if (json === "[DONE]" || json === "") return null;
  try {
    const parsed = JSON.parse(json) as { type?: string; data?: unknown };
    return {
      type: parsed.type ?? "unknown",
      data: parsed.data,
    };
  } catch {
    return null;
  }
}

export interface SearchStreamCallbacks {
  onResults: (results: SearchResult[]) => void;
  onToken: (content: string) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Calls the search API (event stream), parses search_results and token events,
 * and invokes callbacks. Uses NEXT_PUBLIC_SEARCH_API_URL if set, else /api/search.
 */
export async function searchStream(
  query: string,
  callbacks: SearchStreamCallbacks
): Promise<void> {
  const baseUrl =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SEARCH_API_URL
      ? `${process.env.NEXT_PUBLIC_SEARCH_API_URL}${API_PATH}`
      : DEFAULT_API_URL;

  console.log(process.env.NEXT_PUBLIC_SEARCH_API_URLL)
  const url = baseUrl.includes("?") ? `${baseUrl}&query=${encodeURIComponent(query)}` : `${baseUrl}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "text/event-stream" },
    });

    if (!res.ok) {
      throw new Error(`جستجو ناموفق: ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("بدون پاسخ از سرور");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const parsed = parseStreamLine(line);
        if (!parsed) continue;

        if (parsed.type === "search_results") {
          const items = Array.isArray(parsed.data) ? (parsed.data as ApiSearchResultItem[]) : [];
          callbacks.onResults(items.map(mapApiResultToSearchResult));
        } else if (parsed.type === "token") {
          const dataStr =
            typeof parsed.data === "string" ? parsed.data : JSON.stringify(parsed.data);
          let payload: ApiTokenPayload;
          try {
            payload = JSON.parse(dataStr) as ApiTokenPayload;
          } catch {
            continue;
          }
          const content = payload.message?.content ?? "";
          if (content) callbacks.onToken(content);
          if (payload.done) callbacks.onDone?.();
        }
      }
    }

    callbacks.onDone?.();
  } catch (err) {
    callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}
