"use client";

import { useEffect, useState } from "react";

export function SettingsForm() {
  const [tmdbApiKey, setTmdbApiKey] = useState("");
  const [allowedGithubUsers, setAllowedGithubUsers] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [hasAdminToken, setHasAdminToken] = useState(false);
  const [starDisplay, setStarDisplay] = useState<"text" | "css">("text");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        setTmdbApiKey(data.tmdbApiKey ?? "");
        setAllowedGithubUsers((data.allowedGithubUsers ?? []).join(", "));
        setHasAdminToken(Boolean(data.hasAdminToken));
        setStarDisplay(data.starDisplay === "css" ? "css" : "text");
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const payload: Record<string, unknown> = {
      tmdbApiKey,
      allowedGithubUsers: allowedGithubUsers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      starDisplay,
    };
    if (adminToken) payload.adminToken = adminToken;

    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setStatus(data.error ?? "Something went wrong.");
      return;
    }
    setHasAdminToken(Boolean(data.hasAdminToken));
    setAdminToken("");
    setStatus("Saved.");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="tmdbApiKey">
          TMDB API key
        </label>
        <input
          id="tmdbApiKey"
          type="text"
          value={tmdbApiKey}
          onChange={(e) => setTmdbApiKey(e.target.value)}
          placeholder="v3 API key or v4 read access token"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Get one from{" "}
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 underline"
          >
            themoviedb.org/settings/api
          </a>
          .
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="allowedGithubUsers">
          Allowed GitHub usernames
        </label>
        <input
          id="allowedGithubUsers"
          type="text"
          value={allowedGithubUsers}
          onChange={(e) => setAllowedGithubUsers(e.target.value)}
          placeholder="octocat, some-other-user"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Comma-separated. Only these GitHub accounts can sign in (requires GITHUB_ID/GITHUB_SECRET env vars).
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="starDisplay">
          Star display
        </label>
        <select
          id="starDisplay"
          value={starDisplay}
          onChange={(e) => setStarDisplay(e.target.value === "css" ? "css" : "text")}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="text">Plain text stars (★★★☆)</option>
          <option value="css">Custom CSS spans (style with your own CSS)</option>
        </select>
        <p className="mt-1 text-xs text-neutral-500">
          &quot;Custom CSS spans&quot; renders each star as a{" "}
          <code>.star</code> span (with <code>.star-filled</code>/<code>.star-empty</code>) inside a{" "}
          <code>.stars</code> wrapper, so you can restyle ratings with your own CSS.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="adminToken">
          Fallback admin password {hasAdminToken && "(currently set)"}
        </label>
        <input
          id="adminToken"
          type="password"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder={hasAdminToken ? "Leave blank to keep current password" : "At least 8 characters"}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Used to sign in without GitHub OAuth. Leave blank to keep the existing password.
        </p>
      </div>

      {status && <p className="text-sm text-neutral-600 dark:text-neutral-300">{status}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
