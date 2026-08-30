"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function AdminLoginForm({
  githubEnabled,
  callbackUrl,
}: {
  githubEnabled: boolean;
  callbackUrl: string;
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("admin-token", { token, redirect: false, callbackUrl });
    setLoading(false);
    if (!res || res.error) {
      setError("Incorrect password.");
      return;
    }
    window.location.href = res.url ?? callbackUrl;
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-24">
      <h1 className="text-xl font-semibold">Locus Movies admin</h1>

      {githubEnabled && (
        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Sign in with GitHub
        </button>
      )}

      <form onSubmit={handleTokenSubmit} className="space-y-3">
        <label className="block text-sm font-medium" htmlFor="token">
          Admin password
        </label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full rounded border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
