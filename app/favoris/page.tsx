"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookGrid } from "@/components/BookGrid";
import { getFavorites, subscribeFavorites } from "@/lib/favorites";
import type { BookWithAuthor } from "@/lib/supabase/types";

export default function FavorisPage() {
  const [books, setBooks] = useState<BookWithAuthor[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ids = getFavorites();
      if (ids.length === 0) {
        if (!cancelled) setBooks([]);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("books")
        .select("*, author:authors(slug, name)")
        .in("id", ids)
        .returns<BookWithAuthor[]>();
      if (!cancelled) setBooks(data ?? []);
    }

    load();
    const unsubscribe = subscribeFavorites(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Mes favoris</h1>
      <p className="mt-1 text-sm text-ink-light">
        Votre liste d&apos;envies, enregistrée sur cet appareil. Pratique
        pour la montrer en librairie !
      </p>

      {books === null ? null : books.length > 0 ? (
        <div className="mt-5">
          <BookGrid books={books} />
        </div>
      ) : (
        <p className="mt-5 text-ink-light">
          Aucun favori pour l&apos;instant. Touchez le cœur sur un livre
          pour l&apos;ajouter ici.
        </p>
      )}
    </div>
  );
}
