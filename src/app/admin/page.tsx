import Link from "next/link";
import { listRatings } from "@/lib/ratings";
import { readConfig } from "@/lib/config";
import { DeleteRatingButton } from "@/components/DeleteRatingButton";
import { Stars } from "@/components/Stars";

export default async function AdminDashboardPage() {
  const [ratings, config] = await Promise.all([listRatings(), readConfig()]);
  ratings.sort((a, b) => b.ratedAt.localeCompare(a.ratedAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ratings ({ratings.length})</h1>
        <Link
          href="/admin/new"
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + New rating
        </Link>
      </div>

      {ratings.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No ratings yet.{" "}
          <Link href="/admin/new" className="text-indigo-600 underline">
            Add your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {ratings.map((r) => (
            <li key={r.slug} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">
                  {r.title}{" "}
                  <span className="ml-2 inline-flex h-6 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-semibold text-amber-600 dark:bg-indigo-900 dark:text-amber-300">
                    <Stars rating={r.rating} mode={config.starDisplay} />
                  </span>
                </p>
                <p className="text-xs text-neutral-500">
                  {r.mediaType === "tv" ? "TV" : "Movie"}
                  {r.premiereDate ? ` · premiered ${r.premiereDate}` : ""} · rated{" "}
                  {new Date(r.ratedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={r.tmdbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-500 hover:underline"
                >
                  TMDB
                </a>
                <Link href={`/admin/${r.slug}/edit`} className="text-sm text-indigo-600 hover:underline">
                  Edit
                </Link>
                <DeleteRatingButton slug={r.slug} title={r.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
