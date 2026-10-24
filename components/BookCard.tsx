import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Book, BookWithAuthor } from "@/lib/supabase/types";

export function BookCard({ book }: { book: Book | BookWithAuthor }) {
  const author = "author" in book ? book.author : null;

  return (
    <Link href={`/livres/${book.slug}`} className="group block">
      <div className="relative">
        <FavoriteButton bookId={book.id} />
        <BookCover
          title={book.title}
          coverUrl={book.cover_url}
          className="transition group-hover:-translate-y-0.5 group-hover:shadow-md"
        />
        {book.is_signed && book.is_available && (
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm">
            ✍️ Dédicacé
          </span>
        )}
        {!book.is_available && (
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-medium text-cream-light">
            Sur commande
          </span>
        )}
      </div>
      <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug text-ink">
        {book.title}
      </h3>
      {author && (
        <p className="truncate text-[11px] text-ink-light">{author.name}</p>
      )}
      {book.price != null && (
        <p className="text-[11px] font-medium text-accent">
          {book.price.toFixed(2)} €
        </p>
      )}
    </Link>
  );
}
