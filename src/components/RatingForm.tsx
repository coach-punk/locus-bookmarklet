"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RatingSelector } from "./RatingSelector";

interface RatingFormProps {
  mode: "create" | "edit";
  slug?: string;
  initial?: {
    tmdbUrl: string;
    rating: number;
    notes: string;
    title: string;
  };
  /** Prefills the link field, e.g. from the bookmarklet's ?link= param. */
  initialLink?: string;
  /** Closes the window on save instead of redirecting (bookmarklet popup). */
  popup?: boolean;
}

interface PreviewState {
  title: string;
  posterUrl: string | null;
  premiereDate: string | null;
  overview: string;
}

export function RatingForm({ mode, slug, initial, initialLink, popup }: RatingFormProps) {
  const router = useRouter();
  const [link, setLink] = useState(initial?.tmdbUrl ?? initialLink ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 4);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

  async function handlePreview() {
    if (!link) return;
    setResolving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't resolve that link.");
      setPreview({
        title: data.tmdb.title,
        posterUrl: data.tmdb.posterUrl,
        premiereDate: data.tmdb.premiereDate,
        overview: data.tmdb.overview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't resolve that link.");
      setPreview(null);
    } finally {
      setResolving(false);
    }
  }

  // Bookmarklet flow: auto-preview the prefilled link so the popup shows
  // title/poster right away without an extra click.
  useEffect(() => {
    if (!initialLink) return;
    const timer = setTimeout(() => handlePreview(), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLink]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = mode === "create" ? "/api/admin/ratings" : `/api/admin/ratings/${slug}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const payload =
        mode === "create"
          ? { link, rating, notes }
          : { link: link !== initial?.tmdbUrl ? link : undefined, rating, notes };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      if (popup) {
        window.close();
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="link">
          TMDB link
        </label>
        <div className="flex gap-2">
          <input
            id="link"
            type="url"
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.themoviedb.org/movie/414906-the-batman"
            className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={handlePreview}
            disabled={resolving || !link}
            className="rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {resolving ? "Checking…" : "Preview"}
          </button>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Paste a movie, show, or season page from themoviedb.org.
        </p>
      </div>

      {preview && (
        <div className="flex gap-4 rounded border border-neutral-200 p-3 dark:border-neutral-800">
          {preview.posterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.posterUrl} alt="" className="h-24 w-16 rounded object-cover" />
          )}
          <div>
            <p className="font-semibold">{preview.title}</p>
            {preview.premiereDate && (
              <p className="text-xs text-neutral-500">Premiered {preview.premiereDate}</p>
            )}
            <p className="mt-1 line-clamp-3 text-xs text-neutral-500">{preview.overview}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Rating (0–4)</label>
        <RatingSelector value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="notes">
          Notes (markdown, optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading
          ? "Saving…"
          : popup
          ? "Save & close"
          : mode === "create"
          ? "Add rating"
          : "Save changes"}
      </button>
    </form>
  );
}
