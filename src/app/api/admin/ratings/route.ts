import { NextResponse } from "next/server";
import { z } from "zod";
import { readConfig } from "@/lib/config";
import { createRating, listRatings } from "@/lib/ratings";

const createSchema = z.object({
  link: z.string().min(1),
  rating: z.number().int().min(0).max(4),
  notes: z.string().optional(),
});

export async function GET() {
  const ratings = await listRatings();
  ratings.sort((a, b) => b.ratedAt.localeCompare(a.ratedAt));
  return NextResponse.json({ items: ratings });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const config = await readConfig();
  try {
    const rating = await createRating({ ...parsed.data, apiKey: config.tmdbApiKey });
    return NextResponse.json({ item: rating }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create rating" },
      { status: 400 }
    );
  }
}
