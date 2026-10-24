import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminEmpty, AdminRow } from "@/components/admin/AdminList";
import { BackLink } from "@/components/admin/BackLink";
import { pageTitle } from "@/lib/site";
import type { Author } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Gérer les auteurs"),
};

export default async function AdminAuthorsPage() {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const [{ data: authors }, { data: profiles }, { data: books }] =
    await Promise.all([
      admin.from("authors").select("*").order("name").returns<Author[]>(),
      admin.from("profiles").select("author_id"),
      admin.from("books").select("author_id"),
    ]);

  const withAccount = new Set((profiles ?? []).map((p) => p.author_id));
  const bookCount = (id: string) =>
    (books ?? []).filter((b) => b.author_id === id).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin" label="Tableau de bord" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-ink">
          Auteurs
        </h1>
        <Link
          href="/admin/auteurs/nouveau"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-light"
        >
          + Ajouter
        </Link>
      </div>

      {authors && authors.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-2">
          {authors.map((author) => {
            const count = bookCount(author.id);
            return (
              <AdminRow
                key={author.id}
                title={author.name}
                subtitle={`${count} livre${count > 1 ? "s" : ""} · ${
                  withAccount.has(author.id) ? "a un compte" : "sans compte"
                }`}
              >
                <Link
                  href={`/admin/auteurs/${author.id}`}
                  className="text-accent hover:underline"
                >
                  Gérer
                </Link>
              </AdminRow>
            );
          })}
        </ul>
      ) : (
        <AdminEmpty>Aucun auteur pour l&apos;instant.</AdminEmpty>
      )}
    </div>
  );
}
