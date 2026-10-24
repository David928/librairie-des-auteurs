import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorContent } from "@/components/admin/AuthorContent";
import { AdminLinkCard } from "@/components/admin/AdminList";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Espace auteur"),
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ pwError?: string; pwSuccess?: string }>;
}) {
  const session = await requireSession();
  const { pwError, pwSuccess } = await searchParams;
  const { author, superAdmin } = session;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-ink">
          Bonjour{author ? `, ${author.name}` : ""}
        </h1>
        <form action={logout} className="shrink-0">
          <button type="submit" className="text-sm text-ink-light hover:text-accent">
            Se déconnecter
          </button>
        </form>
      </div>

      {pwError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {pwError}
        </p>
      )}
      {pwSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Mot de passe mis à jour.
        </p>
      )}

      {superAdmin && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-light">
            Gestion de la librairie
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            <AdminLinkCard href="/admin/auteurs">👤 Auteurs (fiches, livres, comptes)</AdminLinkCard>
            <AdminLinkCard href="/admin/livres">📚 Tous les livres</AdminLinkCard>
            <AdminLinkCard href="/admin/dedicaces">✍️ Toutes les dédicaces</AdminLinkCard>
            <AdminLinkCard href="/admin/annonces">📣 Annonces de la librairie</AdminLinkCard>
          </div>
          {!author && (
            <div className="mt-4">
              <ChangePasswordModal />
            </div>
          )}
        </section>
      )}

      {author ? (
        <>
          <section className="mt-8 rounded-2xl border border-ink/10 bg-white/60 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">Ma fiche auteur</h2>
              <Link
                href={`/auteurs/${author.slug}`}
                className="shrink-0 text-sm text-accent hover:underline"
              >
                Voir ma fiche →
              </Link>
            </div>
            <AuthorForm author={author} asSuperAdmin={superAdmin} isOwnProfile />
          </section>

          <AuthorContent author={author} superAdmin={superAdmin} />
        </>
      ) : (
        !superAdmin && (
          <p className="mt-6 rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink-light">
            Votre compte n&apos;est relié à aucune fiche auteur. Contactez la
            librairie pour qu&apos;elle le relie à votre fiche.
          </p>
        )
      )}
    </div>
  );
}
