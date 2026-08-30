import slugifyLib from "slugify";
import type { ParsedTmdbLink } from "./tmdb";

export function buildSlug(title: string, parsed: ParsedTmdbLink): string {
  const base = slugifyLib(title, { lower: true, strict: true });
  const seasonPart = parsed.seasonNumber != null ? `-s${parsed.seasonNumber}` : "";
  return `${base}${seasonPart}-${parsed.mediaType}-${parsed.id}`;
}
