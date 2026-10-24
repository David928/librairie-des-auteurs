"use client";

import { useSyncExternalStore } from "react";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";

const getServerSnapshot = () => false;

const HEART_PATH =
  "M12 20.5s-7.5-4.6-9.8-9.2C.7 8 2 4.8 5.2 4.1c2-.4 3.9.5 4.8 2.3.4.8 1.6.8 2 0 .9-1.8 2.8-2.7 4.8-2.3 3.2.7 4.5 3.9 3 7.2-2.3 4.6-9.8 9.2-9.8 9.2Z";

export function FavoriteButton({
  bookId,
  variant = "corner",
}: {
  bookId: string;
  variant?: "corner" | "labeled";
}) {
  const active = useSyncExternalStore(
    subscribeFavorites,
    () => isFavorite(bookId),
    getServerSnapshot
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(bookId);
  }

  const label = active ? "Retirer des favoris" : "Ajouter aux favoris";

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition ${
          active
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-ink/20 text-ink hover:bg-white/50"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={active ? "#c0392b" : "none"}
          stroke={active ? "#c0392b" : "currentColor"}
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} />
        </svg>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={active}
      className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-110"
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "#c0392b" : "none"}
        stroke={active ? "#c0392b" : "currentColor"}
        strokeWidth={1.8}
        className="h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} />
      </svg>
    </button>
  );
}
