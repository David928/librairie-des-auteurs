"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuthorAccess } from "@/lib/auth";
import { checked, text } from "@/lib/form-data";
import { formatDay, formatTime, parisLocalToIso } from "@/lib/dates";
import { revalidateCatalog } from "@/lib/revalidate";
import { sendPushToAll } from "@/lib/push";

/** Date + heure de début + heure de fin (optionnelle), saisies à l'heure de Paris. */
function signingFields(formData: FormData) {
  const date = text(formData, "date");
  const start = text(formData, "start_time");
  const end = text(formData, "end_time");

  const starts_at = date && start ? parisLocalToIso(`${date}T${start}`) : null;
  if (!starts_at) throw new Error("La date et l'heure de début sont obligatoires.");

  const ends_at = date && end ? parisLocalToIso(`${date}T${end}`) : null;
  if (ends_at && ends_at <= starts_at) {
    throw new Error("L'heure de fin doit être après l'heure de début.");
  }

  return {
    title: text(formData, "title"),
    description: text(formData, "description"),
    location: text(formData, "location"),
    book_id: text(formData, "book_id"),
    starts_at,
    ends_at,
  };
}

async function requireSigningAccess(signingId: string) {
  const admin = createAdminClient();
  const { data: signing } = await admin
    .from("signings")
    .select("author_id")
    .eq("id", signingId)
    .maybeSingle();
  if (!signing) redirect("/admin");
  return requireAuthorAccess(signing.author_id);
}

/** Un livre associé à une dédicace doit appartenir au même auteur. */
async function assertBookBelongsTo(bookId: string | null, authorId: string) {
  if (!bookId) return;
  const admin = createAdminClient();
  const { data } = await admin
    .from("books")
    .select("id")
    .eq("id", bookId)
    .eq("author_id", authorId)
    .maybeSingle();
  if (!data) throw new Error("Ce livre n'appartient pas à cet auteur.");
}

export async function createSigning(authorId: string, formData: FormData) {
  const { author } = await requireAuthorAccess(authorId);
  const fields = signingFields(formData);
  await assertBookBelongsTo(fields.book_id, authorId);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("signings")
    .insert({ ...fields, author_id: authorId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidateCatalog();

  if (checked(formData, "notify")) {
    await sendPushToAll({
      title: `Dédicace : ${author.name} ✍️`,
      body: `${formatDay(fields.starts_at)} à ${formatTime(fields.starts_at)}`,
      url: `/dedicaces#${data.id}`,
    }).catch(() => {});
  }
}

export async function updateSigning(signingId: string, formData: FormData) {
  const { author } = await requireSigningAccess(signingId);
  const fields = signingFields(formData);
  await assertBookBelongsTo(fields.book_id, author.id);

  const admin = createAdminClient();
  const { error } = await admin
    .from("signings")
    .update(fields)
    .eq("id", signingId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}

export async function deleteSigning(signingId: string) {
  await requireSigningAccess(signingId);

  const admin = createAdminClient();
  const { error } = await admin.from("signings").delete().eq("id", signingId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}
