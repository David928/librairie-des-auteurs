"use client";

import { useMemo, useState } from "react";
import { AuthorCard } from "@/components/AuthorCard";
import { FilterChips, SearchInput } from "@/components/SearchInput";
import type { Author } from "@/lib/supabase/types";

export type AuthorWithStats = Author & { genres: string[]; bookCount: number };

const LOCAL = "📍 De la région";

export function AuthorBrowser({ authors }: { authors: AuthorWithStats[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const options = useMemo(() => {
    const set = new Set<string>();
    for (const author of authors) for (const g of author.genres) set.add(g);
    const list = Array.from(set).sort();
    return authors.some((a) => a.is_local) ? [LOCAL, ...list] : list;
  }, [authors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return authors.filter((author) => {
      const matchesFilter =
        !filter ||
        (filter === LOCAL ? author.is_local : author.genres.includes(filter));
      const matchesQuery =
        !q ||
        author.name.toLowerCase().includes(q) ||
        author.tagline?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [authors, filter, query]);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un auteur..."
      />
      <FilterChips options={options} value={filter} onChange={setFilter} />

      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {filtered.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              bookCount={author.bookCount}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-ink-light">Aucun auteur ne correspond.</p>
      )}
    </div>
  );
}
