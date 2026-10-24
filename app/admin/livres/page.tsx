import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteBook, toggleBookAvailability } from "@/app/admin/livres/actions";
import { AdminEmpty, AdminRow, EditLink } from "@/components/admin/AdminList";
import { BackLink } from "@/components/admin/BackLink";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { pageTitle } from "@/lib/site";
import type { BookWithAuthor } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Tous les livres"),
};

export default async function AdminBooksPage() {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const { data: books } = await admin
    .from("books")
    .select("*, author:authors(slug, name)")
    .order("created_at", { ascending: false })
    .returns<BookWithAuthor[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin" label="Tableau de bord" />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Tous les livres</h1>
      <p className="mt-1 text-sm text-ink-light">
        Pour ajouter un livre, ouvrez la fiche de son auteur dans{" "}
        <Link href="/admin/auteurs" className="text-accent hover:underline">
          Auteurs
        </Link>
        .
      </p>

      {books && books.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-2">
          {books.map((book) => (
            <AdminRow
              key={book.id}
              title={book.title}
              subtitle={`${book.author.name} · ${
                book.is_available ? "En rayon" : "Sur commande"
              }`}
            >
              <form
                action={toggleBookAvailability.bind(
                  null,
                  book.id,
                  !book.is_available
                )}
              >
                <button type="submit" className="text-accent hover:underline">
                  {book.is_available ? "Épuisé" : "En rayon"}
                </button>
              </form>
              <EditLink href={`/admin/livres/${book.id}`} />
              <form action={deleteBook.bind(null, book.id)}>
                <ConfirmButton message={`Supprimer « ${book.title} » ?`}>
                  ✕
                </ConfirmButton>
              </form>
            </AdminRow>
          ))}
        </ul>
      ) : (
        <AdminEmpty>Aucun livre pour l&apos;instant.</AdminEmpty>
      )}
    </div>
  );
}
