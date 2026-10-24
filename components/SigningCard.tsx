import Link from "next/link";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { AddToCalendar } from "@/components/AddToCalendar";
import { BookCover } from "@/components/BookCover";
import { dateBlock, formatDay, formatTimeRange } from "@/lib/dates";
import type { SigningWithDetails } from "@/lib/supabase/types";

export function SigningCard({
  signing,
  showAuthor = true,
  compact = false,
}: {
  signing: SigningWithDetails;
  showAuthor?: boolean;
  /** Version courte (accueil) : pas de description ni de bouton agenda. */
  compact?: boolean;
}) {
  const { day, month } = dateBlock(signing.starts_at);

  return (
    <article
      id={signing.id}
      className="scroll-mt-20 rounded-xl border border-ink/10 bg-white/60 p-3"
    >
      <div className="flex gap-3">
        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-accent py-2 text-white">
          <span className="font-serif text-2xl font-semibold leading-none">
            {day}
          </span>
          <span className="mt-1 text-[11px] uppercase tracking-wide">
            {month}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium capitalize text-accent">
            {formatDay(signing.starts_at)} ·{" "}
            {formatTimeRange(signing.starts_at, signing.ends_at)}
          </p>
          <h3 className="mt-0.5 font-serif text-base font-semibold leading-snug text-ink">
            {signing.title || "Séance de dédicace"}
          </h3>
          {showAuthor && (
            <Link
              href={`/auteurs/${signing.author.slug}`}
              className="mt-1 flex items-center gap-2 text-sm text-ink hover:text-accent"
            >
              <AuthorAvatar
                name={signing.author.name}
                photoUrl={signing.author.photo_url}
                className="h-6 w-6 text-[10px]"
              />
              <span className="truncate font-medium">
                {signing.author.name}
              </span>
            </Link>
          )}
          {signing.location && (
            <p className="mt-1 text-xs text-ink-light">📍 {signing.location}</p>
          )}
        </div>

        {signing.book && (
          <Link
            href={`/livres/${signing.book.slug}`}
            className="w-14 shrink-0"
            aria-label={signing.book.title}
          >
            <BookCover
              title={signing.book.title}
              coverUrl={signing.book.cover_url}
              sizes="56px"
            />
          </Link>
        )}
      </div>

      {!compact && (
        <>
          {signing.description && (
            <p className="mt-3 whitespace-pre-line text-sm text-ink-light">
              {signing.description}
            </p>
          )}
          <div className="mt-3">
            <AddToCalendar signing={signing} />
          </div>
        </>
      )}
    </article>
  );
}
