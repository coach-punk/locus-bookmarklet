"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRatingButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete the rating for "${title}"? This can't be undone.`)) {
      return;
    }
    setLoading(true);
    await fetch(`/api/admin/ratings/${slug}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
