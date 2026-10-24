"use client";

import { useState } from "react";

export function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // Annulé par l'utilisateur, rien à faire.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papier indisponible, tant pis.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "inline-flex w-fit items-center gap-2 rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink transition hover:bg-ink/5"
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4"
      >
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path strokeLinecap="round" d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
      </svg>
      {copied ? "Lien copié !" : "Partager"}
    </button>
  );
}
