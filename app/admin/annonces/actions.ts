"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuthorAccess, requireSuperAdmin } from "@/lib/auth";
import { text } from "@/lib/form-data";
import {
  computeExpiresAt,
  getActiveAnnouncement,
} from "@/lib/announcement-expiry";
import { revalidateCatalog } from "@/lib/revalidate";
import { sendPushToAll } from "@/lib/push";
import { SITE } from "@/lib/site";

/**
 * Crée une annonce : pour un auteur (authorId), ou au nom de la librairie
 * (authorId null, superadmin uniquement). Un auteur ne peut avoir qu'une
 * annonce en ligne à la fois ; le superadmin n'est pas limité.
 */
export async function createAnnouncement(
  authorId: string | null,
  formData: FormData
) {
  let pushTitle: string = SITE.name;

  if (authorId) {
    const { session, author } = await requireAuthorAccess(authorId);
    pushTitle = `Du nouveau chez ${author.name}`;
    if (!session.superAdmin) {
      const admin = createAdminClient();
      const existing = await getActiveAnnouncement(admin, authorId);
      if (existing) {
        throw new Error(
          "Vous avez déjà une annonce en ligne. Modifiez-la ou supprimez-la avant d'en publier une nouvelle."
        );
      }
    }
  } else {
    await requireSuperAdmin();
  }

  const title = text(formData, "title");
  if (!title) throw new Error("Le titre est obligatoire.");

  const admin = createAdminClient();
  const { error } = await admin.from("announcements").insert({
    author_id: authorId,
    title,
    description: text(formData, "description"),
    image_url: text(formData, "image_url"),
    expires_at: computeExpiresAt(formData.get("expires_at")),
  });
  if (error) throw new Error(error.message);

  revalidateCatalog();

  await sendPushToAll({ title: pushTitle, body: title, url: "/nouveautes" }).catch(
    () => {}
  );
}

async function requireAnnouncementAccess(announcementId: string) {
  const admin = createAdminClient();
  const { data: announcement } = await admin
    .from("announcements")
    .select("author_id")
    .eq("id", announcementId)
    .maybeSingle();
  if (!announcement) redirect("/admin");
  if (announcement.author_id) await requireAuthorAccess(announcement.author_id);
  else await requireSuperAdmin();
}

export async function updateAnnouncement(
  announcementId: string,
  formData: FormData
) {
  await requireAnnouncementAccess(announcementId);

  const title = text(formData, "title");
  if (!title) throw new Error("Le titre est obligatoire.");
  const image_url = text(formData, "image_url");

  const admin = createAdminClient();
  const { error } = await admin
    .from("announcements")
    .update({
      title,
      description: text(formData, "description"),
      expires_at: computeExpiresAt(formData.get("expires_at")),
      ...(image_url ? { image_url } : {}),
    })
    .eq("id", announcementId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}

export async function deleteAnnouncement(announcementId: string) {
  await requireAnnouncementAccess(announcementId);

  const admin = createAdminClient();
  const { error } = await admin
    .from("announcements")
    .delete()
    .eq("id", announcementId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}
