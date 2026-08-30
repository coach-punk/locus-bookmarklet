import { NextResponse } from "next/server";
import { listRatings } from "@/lib/ratings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const mediaType = searchParams.get("mediaType");

  let ratings = await listRatings();

  if (mediaType === "movie" || mediaType === "tv") {
    ratings = ratings.filter((r) => r.mediaType === mediaType);
  }

  // Reverse chronological by when the rating was logged/last changed.
  ratings.sort((a, b) => b.ratedAt.localeCompare(a.ratedAt));

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  if (limit && Number.isFinite(limit) && limit > 0) {
    ratings = ratings.slice(0, limit);
  }

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      count: ratings.length,
      items: ratings,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}
