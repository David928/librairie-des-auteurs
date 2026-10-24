import { createAdminClient } from "@/lib/supabase/admin";
import { deleteBook } from "@/app/admin/livres/actions";
import { deleteSigning } from "@/app/admin/dedicaces/actions";
import { deleteAnnouncement } from "@/app/admin/annonces/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  AdminEmpty,
  AdminRow,
  AdminSection,
  EditLink,
} from "@/components/admin/AdminList";
import { formatDay, formatTimeRange } from "@/lib/dates";
import type { Announcement, Author, Book, Signing } from "@/lib/supabase/types";

/**
 * Livres, dédicaces et annonces d'un auteur, avec ajout / modification /
 * suppression. Utilisé sur le tableau de bord de l'auteur et sur la page de
 * gestion d'un auteur par le superadmin.
 */
export async function AuthorContent({
  author,
  superAdmin,
}: {
  author: Author;
  superAdmin: boolean;
}) {
  const admin = createAdminClient();
  const [{ data: books }, { data: signings }, { data: announcements }] =
    await Promise.all([
      admin
        .from("books")
        .select("*")
        .eq("author_id", author.id)
        .order("created_at", { ascending: false })
        .returns<Book[]>(),
      admin
        .from("signings")
        .select("*")
        .eq("author_id", author.id)
        .order("starts_at", { ascending: false })
        .returns<Signing[]>(),
      admin
        .from("announcements")
        .select("*")
        .eq("author_id", author.id)
        .order("created_at", { ascending: false })
        .returns<Announcement[]>(),
    ]);

  const now = new Date();
  const isPast = (s: Signing) =>
    new Date(s.ends_at ?? s.starts_at).getTime() < now.getTime();
  const hasActiveAnnouncement = (announcements ?? []).some(
    (a) => !a.expires_at || new Date(a.expires_at) > now
  );
  const q = `?auteur=${author.id}`;

  return (
    <>
      <AdminSection
        title="Livres"
        action={{ href: `/admin/livres/nouveau${q}`, label: "+ Ajouter un livre" }}
      >
        {books && books.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {books.map((book) => (
              <AdminRow
                key={book.id}
                title={book.title}
                subtitle={[
                  book.is_available ? "En rayon" : "Sur commande",
                  book.is_signed ? "dédicacé" : null,
                  book.price != null ? `${book.price.toFixed(2)} €` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              >
                <EditLink href={`/admin/livres/${book.id}`} />
                <form action={deleteBook.bind(null, book.id)}>
                  <ConfirmButton message={`Supprimer « ${book.title} » ?`}>
                    Supprimer
                  </ConfirmButton>
                </form>
              </AdminRow>
            ))}
          </ul>
        ) : (
          <AdminEmpty>Aucun livre pour l&apos;instant.</AdminEmpty>
        )}
      </AdminSection>

      <AdminSection
        title="Dédicaces"
        action={{
          href: `/admin/dedicaces/nouvelle${q}`,
          label: "+ Programmer",
        }}
      >
        {signings && signings.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {signings.map((signing) => (
              <AdminRow
                key={signing.id}
                title={
                  <span className={isPast(signing) ? "text-ink-light" : ""}>
                    <span className="capitalize">{formatDay(signing.starts_at)}</span>
                    {isPast(signing) && " (passée)"}
                  </span>
                }
                subtitle={`${formatTimeRange(signing.starts_at, signing.ends_at)}${
                  signing.title ? ` · ${signing.title}` : ""
                }`}
              >
                <EditLink href={`/admin/dedicaces/${signing.id}`} />
                <form action={deleteSigning.bind(null, signing.id)}>
                  <ConfirmButton message="Supprimer cette dédicace ?">
                    Supprimer
                  </ConfirmButton>
                </form>
              </AdminRow>
            ))}
          </ul>
        ) : (
          <AdminEmpty>Aucune dédicace programmée.</AdminEmpty>
        )}
      </AdminSection>

      <AdminSection
        title="Annonces"
        action={
          superAdmin || !hasActiveAnnouncement
            ? { href: `/admin/annonces/nouvelle${q}`, label: "+ Publier" }
            : undefined
        }
      >
        <p className="mt-1 text-xs text-ink-light">
          Une actualité (nouveau livre, prix littéraire, salon...) visible sur
          l&apos;onglet Nouveautés. Une annonce à la fois, 15 jours maximum.
        </p>
        {announcements && announcements.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {announcements.map((a) => (
              <AdminRow
                key={a.id}
                title={a.title}
                subtitle={
                  a.expires_at
                    ? new Date(a.expires_at) > now
                      ? `En ligne jusqu'au ${new Date(a.expires_at).toLocaleDateString("fr-FR")}`
                      : "Expirée"
                    : undefined
                }
              >
                <EditLink href={`/admin/annonces/${a.id}`} />
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <ConfirmButton message={`Supprimer l'annonce « ${a.title} » ?`}>
                    Supprimer
                  </ConfirmButton>
                </form>
              </AdminRow>
            ))}
          </ul>
        ) : (
          <AdminEmpty>Aucune annonce publiée.</AdminEmpty>
        )}
      </AdminSection>
    </>
  );
}
