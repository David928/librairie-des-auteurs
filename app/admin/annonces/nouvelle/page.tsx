import Link from "next/link";
import { requireAuthorAccess, requireSession, requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveAnnouncement } from "@/lib/announcement-expiry";
import { authorAdminPath } from "@/lib/admin-paths";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { BackLink } from "@/components/admin/BackLink";
import { SITE, pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Nouvelle annonce"),
};

/**
 * ?auteur=<id> : annonce d'un auteur. Sans paramètre : annonce de l'auteur
 * connecté, ou annonce au nom de la librairie pour le superadmin.
 */
export default async function NewAnnouncementPage({
  searchParams,
}: {
  searchParams: Promise<{ auteur?: string }>;
}) {
  const session = await requireSession();
  const requested = (await searchParams).auteur;
  const authorId = requested ?? (session.superAdmin ? null : session.author?.id);

  if (!authorId) {
    await requireSuperAdmin();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <BackLink href="/admin/annonces" label="Annonces" />
        <h1 className="mt-3 text-2xl font-semibold text-ink">
          Annonce de la librairie
        </h1>
        <p className="mt-1 text-sm text-ink-light">
          Publiée au nom de {SITE.name} : événement, horaires exceptionnels,
          rentrée littéraire...
        </p>
        <AnnouncementForm
          authorId={null}
          uploadFolder={SITE.uploadFolder}
          redirectTo="/admin/annonces"
        />
      </div>
    );
  }

  const { author } = await requireAuthorAccess(authorId);
  const back = authorAdminPath(session, author.id);
  const existing = session.superAdmin
    ? null
    : await getActiveAnnouncement(createAdminClient(), author.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Nouvelle annonce</h1>
      <p className="mt-1 text-sm text-ink-light">
        Nouveau livre, prix, salon, interview... elle apparaîtra sur
        l&apos;onglet Nouveautés et sur la fiche de {author.name}.
      </p>

      {existing ? (
        <div className="mt-6 rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink">
          Vous avez déjà une annonce en ligne : « {existing.title} ». Une
          seule annonce à la fois — modifiez-la ou supprimez-la avant
          d&apos;en publier une nouvelle.
          <div className="mt-3 flex gap-4">
            <Link
              href={`/admin/annonces/${existing.id}`}
              className="text-accent hover:underline"
            >
              Modifier mon annonce
            </Link>
          </div>
        </div>
      ) : (
        <AnnouncementForm
          authorId={author.id}
          uploadFolder={author.slug}
          redirectTo={back}
        />
      )}
    </div>
  );
}
