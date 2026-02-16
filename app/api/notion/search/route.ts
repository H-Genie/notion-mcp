import { NextRequest, NextResponse } from "next/server";
import { notion, isNotionConfigured } from "@/lib/notion";

/**
 * Notion 검색 API (MCP notion-search와 유사한 기능)
 * GET /api/notion/search?q=검색어
 */
export async function GET(request: NextRequest) {
  if (!isNotionConfigured() || !notion) {
    return NextResponse.json(
      { error: "NOTION_API_KEY가 설정되지 않았습니다. .env.local에 추가하세요." },
      { status: 503 }
    );
  }

  const q = request.nextUrl.searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json(
      { error: "쿼리 파라미터 q가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const response = await notion.search({
      query: q,
      page_size: 10,
    });

    const results = (response.results ?? []).map((item: { id: string; object: string; url?: string; [k: string]: unknown }) => ({
      id: item.id,
      object: item.object,
      url: item.url ?? null,
    }));

    return NextResponse.json({ results, has_more: response.has_more ?? false });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Notion 검색 실패: " + message },
      { status: 500 }
    );
  }
}
