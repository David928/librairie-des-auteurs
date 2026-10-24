import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAnnouncement } from "@/app/admin/annonces/actions";
import { AdminEmpty, AdminRow, AdminSection, EditLink } from "@/components/admin/AdminList";
import { BackLink } from "@/components/admin/BackLink";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { pageTitle } from "@/lib/site";
import type { AnnouncementWithAuthor } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Annonces"),
};

export default async function AdminAnnouncementsPage() {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const { data: announcements } = await admin
    .from("announcements")
    .select("*, author:authors(slug, name)")
    .order("created_at", { ascending: false })
    .returns<AnnouncementWithAuthor[]>();

  const now = new Date();
  const status = (a: AnnouncementWithAuthor) =>
    a.expires_at && new Date(a.expires_at) <= now
      ? "Expirée"
      : a.expires_at
        ? `Jusqu'au ${new Date(a.expires_at).toLocaleDateString("fr-FR")}`
        : "En ligne";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href="/admin" label="Tableau de bord" />
      <h1 className="mt-3 text-2xl font-semibold text-ink">Annonces</h1>
      <p className="mt-1 text-sm text-ink-light">
        Les annonces apparaissent sur l&apos;onglet Nouveautés et envoient
        une notification aux abonnés.
      </p>

      <AdminSection
        title="Toutes les annonces"
        action={{ href: "/admin/annonces/nouvelle", label: "+ Annonce librairie" }}
      >
        {announcements && announcements.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {announcements.map((a) => (
              <AdminRow
                key={a.id}
                title={a.title}
                subtitle={`${a.author?.name ?? "Librairie"} · ${status(a)}`}
              >
                <EditLink href={`/admin/annonces/${a.id}`} />
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <ConfirmButton message={`Supprimer l'annonce « ${a.title} » ?`}>
                    ✕
                  </ConfirmButton>
                </form>
              </AdminRow>
            ))}
          </ul>
        ) : (
          <AdminEmpty>Aucune annonce pour l&apos;instant.</AdminEmpty>
        )}
      </AdminSection>
    </div>
  );
}
