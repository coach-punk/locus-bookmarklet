"use client";

const LABELS = ["0 — skip it", "1 — meh", "2 — okay", "3 — good", "4 — great"];

export function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3, 4].map((n) => (
        <button
          key={n}
          type="button"
          title={LABELS[n]}
          onClick={() => onChange(n)}
          className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
            n === value
              ? "border-indigo-500 bg-indigo-500 text-white"
              : "border-neutral-300 text-neutral-600 hover:border-indigo-400 dark:border-neutral-700 dark:text-neutral-300"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
