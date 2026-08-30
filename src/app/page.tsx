import Link from "next/link";
import { listRatings } from "@/lib/ratings";

export default async function Home() {
  const ratings = await listRatings();
  ratings.sort((a, b) => b.ratedAt.localeCompare(a.ratedAt));
  const recent = ratings.slice(0, 20);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">Locus Movies</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          A self-hosted movie &amp; TV season rating log, backed by{" "}
          <a href="https://www.themoviedb.org/" className="underline">
            TMDB
          </a>
          . Public feed:{" "}
          <Link href="/api/ratings" className="underline">
            /api/ratings
          </Link>
          .
        </p>
      </header>

      {recent.length === 0 ? (
        <p className="text-neutral-500">
          No ratings yet. Sign in to{" "}
          <Link href="/admin/login" className="underline">
            the admin
          </Link>{" "}
          to add one.
        </p>
      ) : (
        <ul className="space-y-4">
          {recent.map((r) => (
            <li
              key={r.slug}
              className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800"
            >
              <div>
                <a href={r.tmdbUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                  {r.title}
                </a>
                <p className="text-xs text-neutral-500">
                  {r.mediaType === "tv" ? "TV" : "Movie"}
                  {r.premiereDate ? ` · premiered ${r.premiereDate}` : ""}
                </p>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                {r.rating}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
