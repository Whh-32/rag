/**
 * Search result item - single result from search.
 */
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
}

/**
 * AI-generated summary of the search results (shown at top).
 */
export interface AISummary {
  query: string;
  summary: string;
  generatedAt: string;
  /** True while tokens are still streaming. */
  isStreaming?: boolean;
}

/**
 * Full search response: AI summary + up to 5 results.
 */
export interface SearchResponse {
  summary: AISummary;
  results: SearchResult[];
}

/** API event: search_results payload. */
export interface ApiSearchResultItem {
  rank: number;
  idPage: number;
  similarity: number;
  preview: string;
  Article_title: string
}

/** API event: token payload (stringified JSON). */
export interface ApiTokenPayload {
  message?: { role?: string; content?: string };
  done?: boolean;
}
