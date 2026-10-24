"use client";

import { useMemo, useState } from "react";
import { BookGrid } from "@/components/BookGrid";
import { FilterChips, SearchInput } from "@/components/SearchInput";
import type { BookWithAuthor } from "@/lib/supabase/types";

const SIGNED = "✍️ Dédicacés";

export function BookBrowser({ books }: { books: BookWithAuthor[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const book of books) if (book.genre) set.add(book.genre);
    const list = Array.from(set).sort();
    return books.some((b) => b.is_signed) ? [SIGNED, ...list] : list;
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesGenre =
        !genre || (genre === SIGNED ? book.is_signed : book.genre === genre);
      const matchesQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.name.toLowerCase().includes(q) ||
        book.publisher?.toLowerCase().includes(q) ||
        book.isbn?.replace(/-/g, "").includes(q.replace(/-/g, ""));
      return matchesGenre && matchesQuery;
    });
  }, [books, genre, query]);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Titre, auteur, éditeur, ISBN..."
      />
      <FilterChips options={genres} value={genre} onChange={setGenre} />

      <div className="mt-5">
        {filtered.length > 0 ? (
          <BookGrid books={filtered} />
        ) : (
          <p className="text-ink-light">Aucun livre ne correspond.</p>
        )}
      </div>
    </div>
  );
}
