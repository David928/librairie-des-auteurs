"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuthorAccess, requireSession } from "@/lib/auth";
import { checked, text } from "@/lib/form-data";
import { revalidateCatalog } from "@/lib/revalidate";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      )}`
    );
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
  await requireSession();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    redirect(
      `/admin?pwError=${encodeURIComponent(
        "Le mot de passe doit contenir au moins 6 caractères."
      )}`
    );
  }
  if (password !== confirm) {
    redirect(
      `/admin?pwError=${encodeURIComponent(
        "Les deux mots de passe ne correspondent pas."
      )}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/admin?pwError=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?pwSuccess=1");
}

/** Met à jour une fiche auteur (la sienne, ou n'importe laquelle pour le superadmin). */
export async function updateAuthor(authorId: string, formData: FormData) {
  const { session } = await requireAuthorAccess(authorId);

  const photo_url = text(formData, "photo_url");
  const name = text(formData, "name");

  const admin = createAdminClient();
  const { error } = await admin
    .from("authors")
    .update({
      tagline: text(formData, "tagline"),
      bio: text(formData, "bio"),
      website: text(formData, "website"),
      instagram: text(formData, "instagram"),
      facebook: text(formData, "facebook"),
      // Seul le superadmin peut renommer une fiche ou changer le badge « région ».
      ...(session.superAdmin
        ? { is_local: checked(formData, "is_local"), ...(name ? { name } : {}) }
        : {}),
      ...(photo_url ? { photo_url } : {}),
    })
    .eq("id", authorId);

  if (error) throw new Error(error.message);

  revalidateCatalog();
}
