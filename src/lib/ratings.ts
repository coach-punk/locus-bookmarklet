import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { RATINGS_DIR } from "./paths";
import { buildSlug } from "./slug";
import {
  fetchTmdbMetadata,
  parseTmdbLink,
  tmdbPageUrl,
  type TmdbMetadata,
} from "./tmdb";

export interface Rating {
  slug: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  seasonNumber: number | null;
  title: string;
  rating: number;
  tmdbUrl: string;
  premiereDate: string | null;
  ratedAt: string;
  updatedAt: string;
  tmdb: TmdbMetadata;
  notes: string;
}

const MIN_RATING = 0;
const MAX_RATING = 4;

function assertValidRating(rating: number) {
  if (
    !Number.isInteger(rating) ||
    rating < MIN_RATING ||
    rating > MAX_RATING
  ) {
    throw new Error(`Rating must be an integer between ${MIN_RATING} and ${MAX_RATING}.`);
  }
}

async function ensureRatingsDir() {
  await fs.mkdir(RATINGS_DIR, { recursive: true });
}

function filePathFor(slug: string): string {
  return path.join(RATINGS_DIR, `${slug}.md`);
}

function toFile(rating: Rating): string {
  const { notes, ...frontmatter } = rating;
  return matter.stringify(notes ?? "", frontmatter);
}

function fromFile(raw: string): Rating {
  const parsed = matter(raw);
  return { ...(parsed.data as Omit<Rating, "notes">), notes: parsed.content.trim() };
}

export async function listRatings(): Promise<Rating[]> {
  await ensureRatingsDir();
  const files = await fs.readdir(RATINGS_DIR);
  const ratings = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (f) => fromFile(await fs.readFile(path.join(RATINGS_DIR, f), "utf8")))
  );
  return ratings;
}

export async function getRating(slug: string): Promise<Rating | null> {
  try {
    const raw = await fs.readFile(filePathFor(slug), "utf8");
    return fromFile(raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export interface CreateRatingInput {
  link: string;
  rating: number;
  notes?: string;
  apiKey: string;
}

export async function createRating(input: CreateRatingInput): Promise<Rating> {
  assertValidRating(input.rating);
  const parsed = parseTmdbLink(input.link);
  const tmdb = await fetchTmdbMetadata(parsed, input.apiKey);
  const slug = buildSlug(tmdb.title, parsed);

  await ensureRatingsDir();
  const existing = await getRating(slug);
  const now = new Date().toISOString();

  const record: Rating = {
    slug,
    tmdbId: parsed.id,
    mediaType: parsed.mediaType,
    seasonNumber: parsed.seasonNumber,
    title: tmdb.title,
    rating: input.rating,
    tmdbUrl: tmdbPageUrl(parsed),
    premiereDate: tmdb.premiereDate,
    ratedAt: existing?.ratedAt ?? now,
    updatedAt: now,
    tmdb,
    notes: input.notes ?? existing?.notes ?? "",
  };

  await fs.writeFile(filePathFor(slug), toFile(record), "utf8");
  return record;
}

export interface UpdateRatingInput {
  rating?: number;
  link?: string;
  notes?: string;
  apiKey: string;
}

export async function updateRating(
  slug: string,
  input: UpdateRatingInput
): Promise<Rating> {
  const existing = await getRating(slug);
  if (!existing) {
    throw new Error(`No rating found for slug "${slug}".`);
  }

  if (input.rating != null) assertValidRating(input.rating);

  // Changing the link re-resolves TMDB metadata and may change the slug
  // (since it's derived from title/media id), so we recreate the file.
  if (input.link) {
    const parsed = parseTmdbLink(input.link);
    const tmdb = await fetchTmdbMetadata(parsed, input.apiKey);
    const newSlug = buildSlug(tmdb.title, parsed);
    const now = new Date().toISOString();

    const record: Rating = {
      slug: newSlug,
      tmdbId: parsed.id,
      mediaType: parsed.mediaType,
      seasonNumber: parsed.seasonNumber,
      title: tmdb.title,
      rating: input.rating ?? existing.rating,
      tmdbUrl: tmdbPageUrl(parsed),
      premiereDate: tmdb.premiereDate,
      ratedAt: existing.ratedAt,
      updatedAt: now,
      tmdb,
      notes: input.notes ?? existing.notes,
    };

    await fs.writeFile(filePathFor(newSlug), toFile(record), "utf8");
    if (newSlug !== slug) {
      await fs.unlink(filePathFor(slug)).catch(() => {});
    }
    return record;
  }

  const record: Rating = {
    ...existing,
    rating: input.rating ?? existing.rating,
    notes: input.notes ?? existing.notes,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(filePathFor(slug), toFile(record), "utf8");
  return record;
}

export async function deleteRating(slug: string): Promise<void> {
  await fs.unlink(filePathFor(slug)).catch((err) => {
    if (err.code !== "ENOENT") throw err;
  });
}
