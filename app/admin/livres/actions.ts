"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuthorAccess, requireSuperAdmin } from "@/lib/auth";
import { checked, price, text } from "@/lib/form-data";
import { revalidateCatalog } from "@/lib/revalidate";
import { slugify } from "@/lib/slugify";
import { sendPushToAll } from "@/lib/push";

function bookFields(formData: FormData) {
  return {
    title: text(formData, "title") ?? "",
    summary: text(formData, "summary"),
    genre: text(formData, "genre"),
    publisher: text(formData, "publisher"),
    isbn: text(formData, "isbn"),
    release_date: text(formData, "release_date"),
    price: price(formData, "price"),
    is_available: checked(formData, "is_available"),
    is_signed: checked(formData, "is_signed"),
  };
}

/** Vérifie que le compte connecté peut gérer ce livre et renvoie son auteur. */
async function requireBookAccess(bookId: string) {
  const admin = createAdminClient();
  const { data: book } = await admin
    .from("books")
    .select("author_id")
    .eq("id", bookId)
    .maybeSingle();
  if (!book) redirect("/admin");
  return requireAuthorAccess(book.author_id);
}

export async function createBook(authorId: string, formData: FormData) {
  const { author } = await requireAuthorAccess(authorId);

  const fields = bookFields(formData);
  if (!fields.title) throw new Error("Le titre est obligatoire.");

  const cover_url = text(formData, "cover_url");
  const slug = `${slugify(fields.title)}-${Date.now().toString(36)}`;

  const admin = createAdminClient();
  const { error } = await admin
    .from("books")
    .insert({ ...fields, author_id: authorId, slug, cover_url });
  if (error) throw new Error(error.message);

  revalidateCatalog();

  if (checked(formData, "notify")) {
    await sendPushToAll({
      title: "Nouveau en rayon 📚",
      body: `${fields.title} — ${author.name}`,
      url: `/livres/${slug}`,
    }).catch(() => {});
  }
}

export async function updateBook(bookId: string, formData: FormData) {
  await requireBookAccess(bookId);

  const fields = bookFields(formData);
  if (!fields.title) throw new Error("Le titre est obligatoire.");
  const cover_url = text(formData, "cover_url");

  const admin = createAdminClient();
  const { error } = await admin
    .from("books")
    .update({ ...fields, ...(cover_url ? { cover_url } : {}) })
    .eq("id", bookId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}

export async function deleteBook(bookId: string) {
  await requireBookAccess(bookId);

  const admin = createAdminClient();
  const { error } = await admin.from("books").delete().eq("id", bookId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}

/** Superadmin : passe rapidement un livre « en rayon » / « sur commande ». */
export async function toggleBookAvailability(bookId: string, isAvailable: boolean) {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from("books")
    .update({ is_available: isAvailable })
    .eq("id", bookId);
  if (error) throw new Error(error.message);

  revalidateCatalog();
}
