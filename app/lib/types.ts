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
  results: ApiSearchResultItem[];
}

/** API event: search_results payload. */
export interface ApiSearchResultItem {
  "rank": number,
  "similarity": number,
  "page_id": number,
  "page_number": number,
  "Article_id": number,
  "Article_title": string,
  "Article_title_tr": string,
  "Article_url": string,
  "language": string,
  "preview": string
}

/** API event: token payload (stringified JSON). */
export interface ApiTokenPayload {
  message?: { role?: string; content?: string };
  done?: boolean;
}

/** Search request options: top_k (number of results), temperature (0–1 creativity). */
export interface SearchOptions {
  top_k?: number;
  temperature?: number;
}
