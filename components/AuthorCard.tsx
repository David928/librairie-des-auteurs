import Link from "next/link";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import type { Author } from "@/lib/supabase/types";

export function AuthorCard({
  author,
  bookCount,
}: {
  author: Author;
  bookCount?: number;
}) {
  return (
    <Link
      href={`/auteurs/${author.slug}`}
      className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white/60 p-3 transition hover:shadow-md"
    >
      <AuthorAvatar name={author.name} photoUrl={author.photo_url} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-base font-semibold text-ink">
          {author.name}
        </h3>
        {author.tagline && (
          <p className="truncate text-xs text-ink-light">{author.tagline}</p>
        )}
        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
          {author.is_local && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 font-medium text-gold">
              Auteur de la région
            </span>
          )}
          {bookCount != null && bookCount > 0 && (
            <span className="rounded-full bg-ink/5 px-2 py-0.5 text-ink-light">
              {bookCount}{" "}livre{bookCount > 1 ? "s" : ""} en librairie
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
