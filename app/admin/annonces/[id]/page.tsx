import { notFound } from "next/navigation";
import { requireAuthorAccess, requireSession, requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorAdminPath } from "@/lib/admin-paths";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { BackLink } from "@/components/admin/BackLink";
import { SITE, pageTitle } from "@/lib/site";
import type { Announcement } from "@/lib/supabase/types";

export const metadata = {
  title: pageTitle("Modifier l'annonce"),
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const admin = createAdminClient();
  const { data: announcement } = await admin
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle<Announcement>();
  if (!announcement) notFound();

  let back = "/admin/annonces";
  let folder: string = SITE.uploadFolder;
  if (announcement.author_id) {
    const { author } = await requireAuthorAccess(announcement.author_id);
    back = session.superAdmin ? "/admin/annonces" : authorAdminPath(session, author.id);
    folder = author.slug;
  } else {
    await requireSuperAdmin();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink href={back} />
      <h1 className="mt-3 text-2xl font-semibold text-ink">
        Modifier « {announcement.title} »
      </h1>
      <AnnouncementForm
        authorId={announcement.author_id}
        uploadFolder={folder}
        announcement={announcement}
        redirectTo={back}
      />
    </div>
  );
}
