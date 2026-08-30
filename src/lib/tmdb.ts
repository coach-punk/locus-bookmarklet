const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_SITE_BASE = "https://www.themoviedb.org";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export type TmdbMediaType = "movie" | "tv";

export interface ParsedTmdbLink {
  mediaType: TmdbMediaType;
  id: number;
  seasonNumber: number | null;
}

/**
 * Accepts TMDB URLs like:
 *  - https://www.themoviedb.org/movie/414906-the-batman
 *  - https://www.themoviedb.org/tv/1399-game-of-thrones
 *  - https://www.themoviedb.org/tv/1399-game-of-thrones/season/2
 */
export function parseTmdbLink(input: string): ParsedTmdbLink {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (!url.hostname.endsWith("themoviedb.org")) {
    throw new Error("Link must be a themoviedb.org page.");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const mediaType = parts[0] as TmdbMediaType;
  if (mediaType !== "movie" && mediaType !== "tv") {
    throw new Error("Link must point to a /movie/ or /tv/ page.");
  }

  const id = parseInt(parts[1], 10);
  if (!Number.isFinite(id)) {
    throw new Error("Couldn't find a TMDB id in that link.");
  }

  let seasonNumber: number | null = null;
  const seasonIdx = parts.indexOf("season");
  if (mediaType === "tv" && seasonIdx !== -1 && parts[seasonIdx + 1]) {
    seasonNumber = parseInt(parts[seasonIdx + 1], 10);
    if (!Number.isFinite(seasonNumber)) seasonNumber = null;
  }

  return { mediaType, id, seasonNumber };
}

export function tmdbPageUrl(parsed: ParsedTmdbLink): string {
  const base = `${TMDB_SITE_BASE}/${parsed.mediaType}/${parsed.id}`;
  return parsed.seasonNumber != null
    ? `${base}/season/${parsed.seasonNumber}`
    : base;
}

async function tmdbFetch(pathname: string, apiKey: string) {
  const isV4Token = apiKey.startsWith("eyJ"); // v4 read access tokens are JWTs
  const url = new URL(`${TMDB_API_BASE}${pathname}`);
  const headers: Record<string, string> = { accept: "application/json" };
  if (isV4Token) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    url.searchParams.set("api_key", apiKey);
  }

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `TMDB request failed (${res.status}): ${body || res.statusText}`
    );
  }
  return res.json();
}

export interface TmdbMetadata {
  title: string;
  overview: string;
  posterPath: string | null;
  posterUrl: string | null;
  backdropPath: string | null;
  voteAverage: number | null;
  genres: string[];
  premiereDate: string | null;
  seasonNumber: number | null;
  seasonName: string | null;
  raw: Record<string, unknown>;
}

export async function fetchTmdbMetadata(
  parsed: ParsedTmdbLink,
  apiKey: string
): Promise<TmdbMetadata> {
  if (!apiKey) {
    throw new Error(
      "No TMDB API key configured. Add one on the admin settings page."
    );
  }

  if (parsed.mediaType === "movie") {
    const data = await tmdbFetch(`/movie/${parsed.id}`, apiKey);
    return {
      title: data.title ?? data.original_title ?? "Untitled",
      overview: data.overview ?? "",
      posterPath: data.poster_path ?? null,
      posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null,
      backdropPath: data.backdrop_path ?? null,
      voteAverage: data.vote_average ?? null,
      genres: (data.genres ?? []).map((g: { name: string }) => g.name),
      premiereDate: data.release_date || null,
      seasonNumber: null,
      seasonName: null,
      raw: data,
    };
  }

  const show = await tmdbFetch(`/tv/${parsed.id}`, apiKey);

  if (parsed.seasonNumber == null) {
    return {
      title: show.name ?? show.original_name ?? "Untitled",
      overview: show.overview ?? "",
      posterPath: show.poster_path ?? null,
      posterUrl: show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : null,
      backdropPath: show.backdrop_path ?? null,
      voteAverage: show.vote_average ?? null,
      genres: (show.genres ?? []).map((g: { name: string }) => g.name),
      premiereDate: show.first_air_date || null,
      seasonNumber: null,
      seasonName: null,
      raw: show,
    };
  }

  const season = await tmdbFetch(
    `/tv/${parsed.id}/season/${parsed.seasonNumber}`,
    apiKey
  );
  return {
    title: `${show.name ?? show.original_name ?? "Untitled"} \u2014 ${season.name ?? `Season ${parsed.seasonNumber}`}`,
    overview: season.overview || show.overview || "",
    posterPath: season.poster_path ?? show.poster_path ?? null,
    posterUrl: (season.poster_path ?? show.poster_path)
      ? `${TMDB_IMAGE_BASE}${season.poster_path ?? show.poster_path}`
      : null,
    backdropPath: show.backdrop_path ?? null,
    voteAverage: season.vote_average ?? show.vote_average ?? null,
    genres: (show.genres ?? []).map((g: { name: string }) => g.name),
    premiereDate: season.air_date || show.first_air_date || null,
    seasonNumber: parsed.seasonNumber,
    seasonName: season.name ?? null,
    raw: { show, season },
  };
}
