"use client";

import { createAnnouncement, updateAnnouncement } from "@/app/admin/annonces/actions";
import { ImageField } from "@/components/admin/ImageField";
import { FormError } from "@/components/admin/FormMessages";
import { useUploadSubmit } from "@/components/admin/useUploadSubmit";
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";
import {
  MAX_ANNOUNCEMENT_DAYS,
  maxExpiryDateInputValue,
} from "@/lib/announcement-expiry";
import type { Announcement } from "@/lib/supabase/types";

export function AnnouncementForm({
  authorId,
  uploadFolder,
  announcement,
  redirectTo,
}: {
  /** null = annonce au nom de la librairie (superadmin). */
  authorId: string | null;
  uploadFolder: string;
  announcement?: Announcement;
  redirectTo: string;
}) {
  const { pending, error, handleSubmit } = useUploadSubmit({
    folder: uploadFolder,
    fileField: "image",
    urlField: "image_url",
    action: (formData) =>
      announcement
        ? updateAnnouncement(announcement.id, formData)
        : createAnnouncement(authorId, formData),
    redirectTo,
  });

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <FormError error={error} />

      <label className={labelClass}>
        Titre
        <input
          type="text"
          name="title"
          required
          placeholder="Ex. Mon nouveau roman est arrivé !"
          defaultValue={announcement?.title}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Texte
        <textarea
          name="description"
          rows={4}
          defaultValue={announcement?.description ?? ""}
          className={inputClass}
        />
      </label>
      <ImageField
        name="image"
        label="Photo (optionnelle)"
        format="announcement"
        currentUrl={announcement?.image_url}
      />
      <label className={labelClass}>
        Date de fin (optionnelle, {MAX_ANNOUNCEMENT_DAYS} jours maximum)
        <input
          type="date"
          name="expires_at"
          defaultValue={announcement?.expires_at?.slice(0, 10) ?? ""}
          max={maxExpiryDateInputValue()}
          className={inputClass}
        />
        <span className={hintClass}>
          Passé cette date, l&apos;annonce disparaît automatiquement. Sans
          date choisie, elle disparaît après {MAX_ANNOUNCEMENT_DAYS} jours.
        </span>
      </label>
      <button type="submit" disabled={pending} className={`mt-2 ${primaryButtonClass}`}>
        {pending
          ? "Enregistrement..."
          : announcement
            ? "Enregistrer"
            : "Publier l'annonce"}
      </button>
    </form>
  );
}
