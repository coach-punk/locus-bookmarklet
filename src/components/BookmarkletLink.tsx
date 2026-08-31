"use client";

export function BookmarkletLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        // Clicking here (instead of dragging to the bookmarks bar) can't do
        // anything useful, since there's no TMDB page in this tab.
        e.preventDefault();
        alert("Drag this button to your bookmarks bar instead of clicking it — then use it from a themoviedb.org page.");
      }}
      draggable
      className="inline-block cursor-grab rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white active:cursor-grabbing"
    >
      Rate on Locus
    </a>
  );
}
