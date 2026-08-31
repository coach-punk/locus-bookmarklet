import { auth, signOut } from "@/auth";
import Link from "next/link";
import { readConfig } from "@/lib/config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  const config = await readConfig();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin">Ratings</Link>
            <Link href="/admin/new">New rating</Link>
            <Link href="/admin/bookmarklet">Bookmarklet</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
              Sign out
            </button>
          </form>
        </div>
      </header>
      {!config.tmdbApiKey && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <span>
              No TMDB API key is configured. Adding or resolving ratings will fail until you set one.
            </span>
            <Link href="/admin/settings" className="whitespace-nowrap font-semibold underline">
              Add API key
            </Link>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
