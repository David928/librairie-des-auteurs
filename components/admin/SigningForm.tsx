"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSigning, updateSigning } from "@/app/admin/dedicaces/actions";
import { FormError } from "@/components/admin/FormMessages";
import {
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";
import { isoToParisLocal } from "@/lib/dates";
import { SITE } from "@/lib/site";
import type { Book, Signing } from "@/lib/supabase/types";

export function SigningForm({
  authorId,
  books,
  signing,
  redirectTo,
}: {
  authorId: string;
  books: Pick<Book, "id" | "title">[];
  signing?: Signing;
  redirectTo: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const start = isoToParisLocal(signing?.starts_at);
  const end = isoToParisLocal(signing?.ends_at);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (signing) await updateSigning(signing.id, formData);
        else await createSigning(authorId, formData);
        router.push(redirectTo);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <FormError error={error} />

      <label className={labelClass}>
        Intitulé
        <input
          type="text"
          name="title"
          placeholder="Séance de dédicace"
          defaultValue={signing?.title ?? ""}
          className={inputClass}
        />
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <label className={`${labelClass} col-span-2 sm:col-span-1`}>
          Date
          <input
            type="date"
            name="date"
            required
            defaultValue={start.slice(0, 10)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Début
          <input
            type="time"
            name="start_time"
            required
            defaultValue={start.slice(11, 16) || "14:00"}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Fin (optionnelle)
          <input
            type="time"
            name="end_time"
            defaultValue={signing ? end.slice(11, 16) : "18:00"}
            className={inputClass}
          />
        </label>
      </div>
      {books.length > 0 && (
        <label className={labelClass}>
          Livre présenté (optionnel)
          <select
            name="book_id"
            defaultValue={signing?.book_id ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className={labelClass}>
        Lieu (optionnel)
        <input
          type="text"
          name="location"
          placeholder={`${SITE.name} (par défaut)`}
          defaultValue={signing?.location ?? ""}
          className={inputClass}
        />
        <span className={hintClass}>
          Laisser vide si la dédicace a lieu à la librairie.
        </span>
      </label>
      <label className={labelClass}>
        Description (optionnelle)
        <textarea
          name="description"
          rows={4}
          placeholder="Lecture d'extraits, échange avec le public..."
          defaultValue={signing?.description ?? ""}
          className={inputClass}
        />
      </label>
      {!signing && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="notify"
            defaultChecked
            className="accent-accent"
          />
          Prévenir les abonnés par notification
        </label>
      )}

      <button type="submit" disabled={pending} className={`mt-2 ${primaryButtonClass}`}>
        {pending
          ? "Enregistrement..."
          : signing
            ? "Enregistrer"
            : "Programmer la dédicace"}
      </button>
    </form>
  );
}
