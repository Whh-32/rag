import { NextRequest } from "next/server";

/**
 * Proxies search to your event-stream API.
 * Set env SEARCH_API_URL to your backend URL (e.g. https://your-api.com/search).
 * Request: GET /api/search?q=دنیا
 */
export async function GET(request: NextRequest) {
  const apiUrl = process.env.SEARCH_API_URL;
  if (!apiUrl) {
    return new Response(
      JSON.stringify({ error: "SEARCH_API_URL not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const url = new URL(apiUrl);
  url.searchParams.set("q", q);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "text/event-stream" },
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream returned ${res.status}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Proxy request failed",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
