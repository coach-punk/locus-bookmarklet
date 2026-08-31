export type StarDisplayMode = "text" | "css";

export function Stars({
  rating,
  max = 4,
  mode = "text",
  className,
}: {
  rating: number;
  max?: number;
  mode?: StarDisplayMode;
  className?: string;
}) {
  const label = `${rating} out of ${max} stars`;

  if (mode === "css") {
    return (
      <span
        className={`stars${className ? ` ${className}` : ""}`}
        data-rating={rating}
        data-max={max}
        aria-label={label}
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={i < rating ? "star star-filled" : "star star-empty"} />
        ))}
      </span>
    );
  }

  return (
    <span className={className} aria-label={label}>
      {"\u2605".repeat(rating)}
      {"\u2606".repeat(Math.max(max - rating, 0))}
    </span>
  );
}
