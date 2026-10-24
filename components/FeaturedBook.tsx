import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import type { BookWithAuthor } from "@/lib/supabase/types";

export function FeaturedBook({
  book,
  label,
}: {
  book: BookWithAuthor;
  label: string;
}) {
  return (
    <Link
      href={`/livres/${book.slug}`}
      className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white/60 p-3 transition hover:shadow-md"
    >
      <div className="w-20 shrink-0">
        <BookCover
          title={book.title}
          coverUrl={book.cover_url}
          sizes="80px"
          priority
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
          {label}
        </span>
        <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-ink">
          {book.title}
        </h3>
        <p className="truncate text-sm text-ink-light">{book.author.name}</p>
        {book.summary && (
          <p className="mt-1 line-clamp-2 text-xs text-ink-light">
            {book.summary}
          </p>
        )}
        {book.price != null && (
          <p className="mt-1 text-sm font-semibold text-ink">
            {book.price.toFixed(2)} €
          </p>
        )}
      </div>
    </Link>
  );
}
