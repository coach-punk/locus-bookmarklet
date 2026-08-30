import { NextResponse } from "next/server";
import { z } from "zod";
import { readConfig } from "@/lib/config";
import { fetchTmdbMetadata, parseTmdbLink, tmdbPageUrl } from "@/lib/tmdb";

const schema = z.object({ link: z.string().min(1) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const config = await readConfig();
    const link = parseTmdbLink(parsed.data.link);
    const tmdb = await fetchTmdbMetadata(link, config.tmdbApiKey);
    return NextResponse.json({ tmdb, tmdbUrl: tmdbPageUrl(link) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to resolve link" },
      { status: 400 }
    );
  }
}
