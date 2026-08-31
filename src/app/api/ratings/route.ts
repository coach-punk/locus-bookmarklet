import { NextResponse } from "next/server";
import { listRatings } from "@/lib/ratings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const mediaType = searchParams.get("mediaType");
  const since = searchParams.get("since");

  let ratings = await listRatings();

  if (mediaType === "movie" || mediaType === "tv") {
    ratings = ratings.filter((r) => r.mediaType === mediaType);
  }

  // Lets polling clients (e.g. a plugin watching for new ratings) ask for
  // only what changed since their last fetch, instead of the whole feed.
  if (since) {
    const sinceDate = new Date(since);
    if (!Number.isNaN(sinceDate.getTime())) {
      ratings = ratings.filter((r) => new Date(r.updatedAt) > sinceDate);
    }
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
        // Public read-only feed: meant to be fetched from other sites/blogs.
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
