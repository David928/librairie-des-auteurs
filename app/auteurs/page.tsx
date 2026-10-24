import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  AuthorBrowser,
  type AuthorWithStats,
} from "@/components/AuthorBrowser";
import { pageTitle } from "@/lib/site";
import type { Author } from "@/lib/supabase/types";

export const revalidate = 3600;

export const metadata = {
  title: pageTitle("Nos auteurs"),
};

export default async function AuteursPage() {
  const supabase = await createClient();
  const [{ data: authors }, { data: books }] = await Promise.all([
    supabase
      .from("authors")
      .select("*")
      .order("name", { ascending: true })
      .returns<Author[]>(),
    supabase
      .from("books")
      .select("author_id, genre")
      .eq("is_available", true)
      .returns<{ author_id: string; genre: string | null }[]>(),
  ]);

  // Les genres d'un auteur sont déduits de ses livres disponibles.
  const withStats: AuthorWithStats[] = (authors ?? []).map((author) => {
    const own = (books ?? []).filter((b) => b.author_id === author.id);
    return {
      ...author,
      bookCount: own.length,
      genres: Array.from(
        new Set(own.map((b) => b.genre).filter((g): g is string => !!g))
      ),
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Nos auteurs</h1>
      <p className="mt-1 text-sm text-ink-light">
        Leur parcours, leur univers et leurs livres disponibles à la
        librairie.
      </p>
      <Link
        href="/livres"
        className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
      >
        📚 Voir tous les livres plutôt que par auteur →
      </Link>
      <div className="mt-5">
        <AuthorBrowser authors={withStats} />
      </div>
    </div>
  );
}
