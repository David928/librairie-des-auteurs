"use client";

import { useState } from "react";
import { updateAuthor } from "@/app/admin/actions";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { ImageField } from "@/components/admin/ImageField";
import { FormError, FormSuccess } from "@/components/admin/FormMessages";
import { useUploadSubmit } from "@/components/admin/useUploadSubmit";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";
import type { Author } from "@/lib/supabase/types";

export function AuthorForm({
  author,
  asSuperAdmin = false,
  isOwnProfile = false,
}: {
  author: Author;
  /** Le superadmin peut aussi changer le nom et le badge « auteur de la région ». */
  asSuperAdmin?: boolean;
  isOwnProfile?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const { pending, error, handleSubmit } = useUploadSubmit({
    folder: author.slug,
    fileField: "photo",
    urlField: "photo_url",
    action: (formData) => updateAuthor(author.id, formData),
    onSuccess: () => setSaved(true),
  });

  return (
    <form
      onSubmit={(e) => {
        setSaved(false);
        handleSubmit(e);
      }}
      className="mt-4 flex flex-col gap-4"
    >
      <FormError error={error} />
      <FormSuccess message={saved && !error ? "Fiche enregistrée." : null} />

      {asSuperAdmin && (
        <label className={labelClass}>
          Nom affiché
          <input
            type="text"
            name="name"
            required
            defaultValue={author.name}
            className={inputClass}
          />
        </label>
      )}
      <label className={labelClass}>
        Accroche
        <input
          type="text"
          name="tagline"
          placeholder="Ex. Romancière · Polar"
          defaultValue={author.tagline ?? ""}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Biographie
        <textarea
          name="bio"
          rows={7}
          placeholder="Votre parcours, vos inspirations, votre lien avec la région..."
          defaultValue={author.bio ?? ""}
          className={inputClass}
        />
      </label>
      <ImageField
        name="photo"
        label="Photo (portrait)"
        format="portrait"
        currentUrl={author.photo_url}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          Site web
          <input
            type="text"
            name="website"
            placeholder="monsite.fr"
            defaultValue={author.website ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Instagram
          <input
            type="text"
            name="instagram"
            placeholder="@pseudo"
            defaultValue={author.instagram ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Facebook (lien)
          <input
            type="text"
            name="facebook"
            placeholder="facebook.com/..."
            defaultValue={author.facebook ?? ""}
            className={inputClass}
          />
        </label>
      </div>
      {asSuperAdmin && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="is_local"
            defaultChecked={author.is_local}
            className="accent-accent"
          />
          Auteur de la région (badge 📍 sur sa fiche)
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Enregistrement..." : "Enregistrer la fiche"}
        </button>
        {isOwnProfile && <ChangePasswordModal />}
      </div>
    </form>
  );
}
