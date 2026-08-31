"use client";

import { useState } from "react";

const LABELS = ["Skip it", "Meh", "Okay", "Good", "Great"];
const MAX = 4;

export function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: MAX }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            title={LABELS[n]}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n === value ? 0 : n)}
            className={`text-3xl leading-none transition hover:scale-110 ${
              n <= display ? "text-amber-500" : "text-neutral-300 dark:text-neutral-700"
            }`}
          >
            <span aria-hidden="true">{n <= display ? "\u2605" : "\u2606"}</span>
            <span className="sr-only">{LABELS[n]}</span>
          </button>
        ))}
      </div>
      <span className="text-sm text-neutral-500">{LABELS[value]}</span>
    </div>
  );
}
