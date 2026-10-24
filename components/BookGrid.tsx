"use client";

import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import type { Book, BookWithAuthor } from "@/lib/supabase/types";

export function BookGrid({
  books,
  limit,
}: {
  books: (Book | BookWithAuthor)[];
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const showAll = expanded || !limit || books.length <= limit;
  const visible = showAll ? books : books.slice(0, limit);

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 md:grid-cols-6">
        {visible.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {!showAll && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 w-full rounded-full border border-ink/15 py-2.5 text-center text-sm font-medium text-ink transition hover:bg-cream"
        >
          Voir tous les livres ({books.length})
        </button>
      )}
    </div>
  );
}
