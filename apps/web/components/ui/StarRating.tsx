"use client";

import { useState } from "react";

interface StarRatingProps {
  /** Current rating value (0–5) */
  value: number;
  /** Total number of ratings — shown next to stars when provided */
  count?: number;
  /** If true, renders as clickable stars */
  interactive?: boolean;
  /** Called when user selects a star in interactive mode */
  onChange?: (stars: number) => void;
  /** Visual size of stars */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const;

export function StarRating({
  value,
  count,
  interactive = false,
  onChange,
  size = "md",
  className = "",
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = interactive && hovered > 0 ? hovered : value;

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`Rating: ${value.toFixed(1)} out of 5${count !== undefined ? ` (${count} reviews)` : ""}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = displayValue >= star;
          const half = !filled && displayValue >= star - 0.5;

          return (
            <button
              key={star}
              type={interactive ? "button" : undefined}
              aria-label={interactive ? `Rate ${star} stars` : undefined}
              onClick={interactive && onChange ? () => onChange(star) : undefined}
              onMouseEnter={interactive ? () => setHovered(star) : undefined}
              onMouseLeave={interactive ? () => setHovered(0) : undefined}
              disabled={!interactive}
              className={[
                SIZE[size],
                "relative flex-shrink-0",
                interactive
                  ? "cursor-pointer transition-transform hover:scale-110"
                  : "cursor-default",
              ].join(" ")}
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* background (empty) star */}
                <path
                  d="M10 1.5l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.77l-4.78 2.51.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                />
                {/* filled overlay */}
                {(filled || half) && (
                  <clipPath id={`half-clip-${star}`}>
                    <rect x="0" y="0" width={half ? "50%" : "100%"} height="100%" />
                  </clipPath>
                )}
                {(filled || half) && (
                  <path
                    d="M10 1.5l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.77l-4.78 2.51.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                    fill="#f59e0b"
                    clipPath={half ? `url(#half-clip-${star})` : undefined}
                  />
                )}
              </svg>
            </button>
          );
        })}
      </span>

      {count !== undefined && (
        <span className="text-xs text-content-muted">
          {value.toFixed(1)}
          <span className="ml-1">({count})</span>
        </span>
      )}
    </span>
  );
}
