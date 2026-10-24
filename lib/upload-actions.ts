"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

/**
 * Génère une URL d'envoi signée pour une photo. Un auteur ne peut envoyer que
 * dans son propre dossier ; le superadmin peut envoyer dans n'importe lequel.
 * Le fichier part ensuite directement du navigateur vers Supabase Storage,
 * ce qui contourne la limite de taille des Server Actions.
 */
export async function createImageUploadUrl(folder: string, fileName: string) {
  const session = await getSession();
  if (!session) throw new Error("Vous devez être connecté.");
  if (!session.superAdmin && session.author?.slug !== folder) {
    throw new Error("Accès refusé.");
  }

  const base = slugify(fileName.replace(/\.[^.]+$/, "")) || "image";
  const ext = /\.([a-z0-9]+)$/i.exec(fileName)?.[1]?.toLowerCase() ?? "jpg";
  const path = `${slugify(folder)}/${Date.now()}-${base}.${ext}`;

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("images")
    .createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Envoi impossible.");

  const { data: publicUrl } = admin.storage.from("images").getPublicUrl(path);
  return { path, token: data.token, publicUrl: publicUrl.publicUrl };
}
