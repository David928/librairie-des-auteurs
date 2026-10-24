"use client";

import { createClient } from "@/lib/supabase/client";
import { createImageUploadUrl } from "@/lib/upload-actions";

/** Envoie une photo dans le dossier donné et renvoie son URL publique. */
export async function uploadImageClient(
  folder: string,
  file: File
): Promise<string> {
  const { path, token, publicUrl } = await createImageUploadUrl(
    folder,
    file.name
  );

  const supabase = createClient();
  const { error } = await supabase.storage
    .from("images")
    .uploadToSignedUrl(path, token, file);
  if (error) throw new Error(error.message);

  return publicUrl;
}
