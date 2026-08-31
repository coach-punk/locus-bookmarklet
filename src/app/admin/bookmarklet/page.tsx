import { headers } from "next/headers";
import { BookmarkletLink } from "@/components/BookmarkletLink";

function buildBookmarklet(origin: string): string {
  // Minified so it fits on one line as a bookmark href; grabs the current
  // page's URL and pops up the pre-filled "add rating" form. Warns instead
  // of silently doing nothing if the current page isn't a TMDB page, or if
  // the popup gets blocked.
  const src = `(function(){
    if (!/(^|\\.)themoviedb\\.org$/.test(location.hostname)) {
      alert('Locus bookmarklet: this only works on a themoviedb.org movie, show, or season page.');
      return;
    }
    var u=encodeURIComponent(location.href);
    var w=460,h=720;
    var y=window.screenY+Math.max(0,(window.outerHeight-h)/2);
    var x=window.screenX+Math.max(0,(window.outerWidth-w)/2);
    var win=window.open('${origin}/admin/new?link='+u+'&popup=1','locus-rating','width='+w+',height='+h+',top='+y+',left='+x);
    if (!win) {
      alert('Locus bookmarklet: your browser blocked the popup. Allow popups for this site and try again.');
    }
  })();`;
  return `javascript:${encodeURIComponent(src.replace(/\s+/g, " "))}`;
}

export default async function BookmarkletPage() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const origin = `${proto}://${host}`;
  const href = buildBookmarklet(origin);

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold">Bookmarklet</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Drag this link to your bookmarks bar. From any TMDB movie, show, or
        season page, click it to pop up a small &quot;add rating&quot; window
        pre-filled with that page&apos;s link — pick a rating and save, and
        the popup closes itself.
      </p>

      <p className="my-6">
        <BookmarkletLink href={href} />
      </p>

      <p className="text-xs text-neutral-500">
        You must be signed in to the admin here for the popup to work — it
        uses your existing session.
      </p>
    </div>
  );
}
